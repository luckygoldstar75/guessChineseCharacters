import _myConfig from '../../config.js';
import AWS from 'aws-sdk';
import validator from 'validator';
//var Joi = require('joi'); //TODO : study usage
//var Boom = require('boom');//TODO : study usage
import _log from '../../loggingTools';
// import inert from 'inert';
import SESSIONS from '../../CRUD-sessions.js';
var SHA256 = require("crypto-js/sha256");


exports.register = function(server, options, next) {
    
    server.register([
        {
            register: require('hapi-auth-cookie')
        }
    ], function(err) {
        if (err) {
            console.error('Failed to load a plugin:', err);
            throw err;
        }

        // Set our server authentication strategy
        server.auth.strategy('standard', 'cookie', {
            password: 'somecrazycookiesecretthatcantbeguesseswouldgohere', // cookie secret
            cookie: 'authsid', // Cookie name
            isSecure: false, // required for non-https applications
            ttl: _myConfig.server.cookieExpirationTimeMs,
            validateFunc: function (request, session, callback) {
				cache.get(session.sid, (err, cached) => {

                if (err) {
                    return callback(err, false);
                }

                if (!cached) {
                    return callback(null, false);
                }

                return callback(null, true, cached.account);
            });
           }
        });
        
        server.auth.default({
			strategy: 'standard',
			//scope: ['admin']
		});
		
		const cache = server.cache({ segment: 'sessions', expiresIn: _myConfig.server.cookieExpirationTimeMs });
		server.app.cacheSession = cache;
		
		loadAuthRoutes();
		next();
    });  

function loadAuthRoutes()
{
	console.log("Now loading routes for authPlugin");

   server.route(
   {
        method: 'GET',
        path: '/logout',
        config: {
            auth: {
                    strategy: 'standard'                    
                },            
		},
        handler: function(request, reply) {
				console.debug("REQUEST AUTH: " + JSON.stringify(request.auth));
				request.server.app.cacheSession.drop(request.state['authsid'].sid);
                request.cookieAuth.clear();
                return reply('Logout Successful!');
            }
    });	
	
	
    server.route(
      {
           path: '/login',
           method: ['GET', 'POST'],
           config : {
		    auth : false,
			cors: {
				origin: ['http://localhost:3000'],
				credentials : true,
				additionalHeaders: ['cache-control', 'x-requested-with', 'accept-language', "Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type", "CORELATION_ID"]
		   }},
           handler: async ( request, reply ) => {
			if (request.method === 'get') { // TODO FIX : not working
				var isLoggedIn = false;
		
				if (request.auth.isAuthenticated)	 {
					isLoggedIn = true;
				}
        
				return reply({'isLoggedIn' : isLoggedIn})
			}
				
			let message = '';
			let account = null;			
							
			if (request.method === 'post') {
				try {
					const { email, password } = request.payload;
					console.debug("password NEEDS to be checked: " + email +"/" + password);	 //todo : request.IPsource

					if (email == null || password == null) {
						return reply({
							error: true,
							errMessage: "LOGIN/PASSWORD sont obligatoires"
						});
					}

					var ddb = new AWS.DynamoDB();

					//EMAIL VALIDATION
					var escapedInputEmail = (validator.escape(email)).toLowerCase();

					if(escapedInputEmail == null || !validator.isEmail(escapedInputEmail)) {
						_log.logging(console,request,"INVALID EMAIL : escaped email : " + escapedInputEmail);
						return reply('Input is not a valid email. Attempt has been reported!').code(200);
					}

					//EMAIL VALIDATED: legt's check mdp in db
					var params = {
						TableName: "my_players",
						Key : {'email' : {S: escapedInputEmail}}
					};

					console.debug("before invocation of AWS.DynamoDB");
					ddb.getItem(params, async function(err, data) {
					if (err) {
						return reply({
							error: true,
							errMessage: err + ': Unable to read item'
						});
					}	 
					else if (data === undefined || data.Item === undefined) {
						return reply({
							error: true,
							errMessage: "LOGIN/PASSWORD NOT FOUND"
						});
					}
					else {	
						console.debug("DATA: " + data );
						var _reply= JSON.stringify(data.Item);
						console.debug("DATA: " + data + " REPLY: " +_reply);
						var mdpsale= data.Item["motDePasseSalé"].S;
						var sel= data.Item.sel.S;
						var saltedPasswordHash=SHA256(sel + password).toString();
		                console.debug("mdpsale: " + mdpsale + " sel: " +sel +  " saltedPasswordHash: " + saltedPasswordHash);
		                //console.debug(typeof(mdpsale) + " " +  typeof(saltedPasswordHash));
		
		                if(saltedPasswordHash !== mdpsale.toString()) {
		                  return reply({
		                        error: true,
		                        errMessage: "LOGIN/PASSWORD NOT FOUND"
		                    });
		                }
		                else { // account and input password DO match ==> Now : Register new session in db and memory
		                  console.debug("good password");
						  const sid = _myConfig.guid();
						  request.server.app.cacheSession.set(sid, { email }, null, (err) => {
							  if(err) {console.error("could not set session sid in cache: " + err )}
							  else {
								  console.log("Success: set session sid in cache " );
								  request.cookieAuth.set({sid});								  
							  }});
						  
						// Get last Session for scores display (OPTIONAL / FALLBACK possible without updated scores)
		                var nbGood = undefined, nbFalse=undefined;
		
		                try {
							
							function getResult(err, myLastSession) {
		                          if (err !== undefined && err !== null) {
		                          console.error("error : " + err + err.stack);
		                          }
		                          else {
		                          console.log("lastSession retrieved: ", myLastSession);
		                          if (myLastSession !== undefined && myLastSession.nbFalse !== undefined && myLastSession.nbGood !== undefined) {
									  nbGood = myLastSession.nbGood;
									  nbFalse = myLastSession.nbFalse;
		                          }
		                          else {
		                            console.warn("Could not retrieve scores from last session: last session undefined");
		                           }
		                          }
		                          
		                        storeNewSession(escapedInputEmail,sid , nbGood , nbFalse);  	
		                    }	
							
							SESSIONS.retrieveLastSession(console, escapedInputEmail, getResult);    
		                 }
		                 catch (ex)  {
		                          console.error("Exception triggered when attempting to store update score : ", ex.message);
		                 }
                
					function storeNewSession(_escapedInputEmail,_sid , _nbGood , _nbFalse) {  	
						//STORE NEW SESSION TO DB (NOT ESSENTIAL : can play on memory but scores not updated in DB)
					 try {
					   console.log("_escapedInputEmail, _token, _nbGood, _nbFalse: " + _escapedInputEmail +"," + _sid + "," + _nbGood + "," + _nbFalse);
					   var response = {
                            'sid' : _sid,
                            'scope': _escapedInputEmail,
                            'nbGood': _nbGood,
                            'nbFalse' : _nbFalse
                          };
				
					function _afterCreate(err) {	
					  if (err !== null) {
							response.err="WARN_SESSION_COULD_NOT_BE_SAVED_TO_DB";
						}
						console.log("just before returning response to login");
					   return reply(response);							
					  }	
					
					SESSIONS.create(_escapedInputEmail, _sid, _nbGood, _nbFalse, _afterCreate);                  
					}
					catch (ex)  {
                      console.error("Exception triggered when attempting to store new session", ex.message);
                      return reply({
                            level: WARN,
                            message: "session was memory stored but could not be saved in db"
                        });
					}
              }
              }}});
          }
		  catch (ex)  {
              console.error("login error : ", ex.message);
              return reply({
                        level: ERROR,
                        message: 'server-side error'
				});
		  }
		}
	}});
	


console.log("Routes for auth plugin loaded");
}};



exports.register.attributes = {
	name : 'authPlugin',
	//version : '1.0.0'
};
