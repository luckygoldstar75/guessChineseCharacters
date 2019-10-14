import _myConfig from '../../config.js';
import AWS from 'aws-sdk';
import validator from 'validator';
//var Joi = require('joi'); //TODO : study usage
//var Boom = require('boom');//TODO : study usage
import _log from '../../loggingTools';
// import inert from 'inert';
import SESSIONS from '../../CRUD-sessions.js';
var SHA256 = require("crypto-js/sha256");
import crypto from "crypto";
import MY_PLAYERS from '../../CRUD-my_players.js';
import _commonsServerHelpers from '../../commons-serverHelpers.js';
import _commonsLinkHelpers from '../../commons-linkHelpers.js';  
import _commonsPasswordHelpers from '../../commons-passwordHelpers.js';  
require('dotenv').config();


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
            password: process.env.authCookieSecretKey, // cookie secret
            cookie: 'authsid', // Cookie name
            isSameSite : 'Lax',
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
                }/*,
            cors: {
				origin: ['http://localhost:3000'],
				credentials : true,
				additionalHeaders: ['cache-control', 'x-requested-with', 'accept-language', "Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type"]
		   }        */    
		},
        handler: function(request, reply) {
			try {
				console.debug("REQUEST AUTH: " + JSON.stringify(request.auth));
				request.server.app.cacheSession.drop(request.state['authsid'].sid);
                request.cookieAuth.clear();
                return reply({message : 'Logout Successful!'}).code(200);
			}
			catch(ex) {
				console.error("Exception triggered when attempting to logout : ", ex.message);
				return reply({message : 'Logout Failure!'}).code(500);
			}
       }
    });
	
	
    server.route(
      {
           path: '/login',
           method: ['GET', 'POST'],
           config : {
		    auth : false /*,
			cors: {
				origin: ['http://localhost:3000'],
				credentials : true,
				additionalHeaders: ['cache-control', 'x-requested-with', 'accept-language', "Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type"]
		   }*/},
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
						return reply({errMessage : 'Input is not a valid email. Attempt has been reported!'}).code(200);
					}

					//EMAIL VALIDATED: legt's check mdp in db
					var params = {
						TableName: "my_players",
						Key : {'email' : {S: escapedInputEmail}}
					};

					console.debug("before invocation of AWS.DynamoDB");
					ddb.getItem(params, async function(err, data) {
					if (err) {
                  console.log("login failed: could not get in DynamoDb", err, err.stack);
						return reply({
							error: true,
							errMessage: 'We are experiencing temporary technical issue: Unable to login'
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
						var mdpsale= data.Item["saltedPassword"].S;
						var sel= data.Item.salt.S;
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
		                var userLastSession;
		
		                try {
                      SESSIONS.retrieveLastSession(console, escapedInputEmail, afterRetrieveLastSession);    
                        
							function afterRetrieveLastSession(err, myLastSession) {
		                          if (err !== undefined && err !== null) {
		                          console.error("error : " + err + err.stack);
		                          }
		                          else {
		                          console.log("lastSession retrieved: ", myLastSession);
		                          if (myLastSession !== undefined) {
                                       userLastSession = myLastSession.timestamp;									  
		                          }
		                          else {
		                            console.warn("Could not retrieve last session: last session undefined");
		                           }
		                          }
		                          
		                        storeNewSession(escapedInputEmail,sid);  	
		                    }	
							
							  
		                 }
		                 catch (ex)  {
		                          console.error("Exception triggered when attempting to store update score : ", ex.message);
		                 }
                
					function storeNewSession(_escapedInputEmail,_sid) {  	
						//STORE NEW SESSION TO DB (NOT ESSENTIAL : can play on memory but scores not updated in DB)
					 try {
					   console.log("_escapedInputEmail, __sessionId" + _escapedInputEmail +"," + _sid);
					   var response = {
                            'sid' : _sid,
                            'scope': _escapedInputEmail,
                            'lastSession' : userLastSession ,
                            'avatarUrl' : data.Item.avatarUrl.S,
                            'pseudo' : data.Item.pseudo.S
                          };
				
					function _afterCreate(err) {	
					  if (err !== null) {
							response.err="WARN_SESSION_COULD_NOT_BE_SAVED_TO_DB";
						}
						console.log("just before returning response to login");
					   return reply(response);							
					  }	
					
					SESSIONS.create(_escapedInputEmail, _sid, _afterCreate);                  
					}
					catch (ex)  {
                      console.error("Exception triggered when attempting to store new session", ex.message);
                      return reply({
                            level: 'WARN',
                            message: "session was memory stored but could not be saved in db"
                        });
					}
              }
              }}});
          }
		  catch (ex)  {
              console.error("login error : ", ex.message);
              return reply({
                        level: 'ERROR',
                        message: 'server-side error'
				});
		  }
		}
	}});
    
   server.route(
   {
        method: 'POST',
        path: '/forgotPassword',
        config: {
            auth: false
        },
    handler: function(request, reply) {
      try {
         const { email } = request.payload;
         console.log("password forgot request received for email: " + email );	 //todo : request.IPsource pour logguer
         var escapedInputEmail = (validator.escape(email)).toLowerCase();
         console.log("escaped email to be checked: " + escapedInputEmail );
	
      if(!validator.isEmail(escapedInputEmail)) {
            console.log(console,request,"INVALID EMAIL : escaped email : " + escapedInputEmail);
            return reply({error : true , message : 'Input is not a valid email.'}).code(422);
      }
      else {
        console.log("email ok")
        var link = Buffer.from(crypto.createHash('sha512').update(crypto.randomBytes(512)).digest('hex').toString()+";"+escapedInputEmail, 'binary')
            .toString('base64');

        console.log("New forgot password link :" + link);
        var linkExpiracyTimestamp = parseInt(new Date().setTime(new Date().getTime() + 2*60*60*1000));
 
        MY_PLAYERS.renewForgotPasswordConfirmationLink(escapedInputEmail, link, linkExpiracyTimestamp)
        .then( resolve =>  {console.log('New Forgot password link for player stored successfully');
               // CALL AMAZON for  sending email including unique link 
              MY_PLAYERS.sendEmailForForgotPassword(console, '"J\'apprends le chinois en jouant" <noreply@japprendslechinoisenjouant.fr>',
                                                                      escapedInputEmail, _commonsServerHelpers.getHostFromRequest(request) + '/forgotPassword/' + link);
              })
        .then(resolve => {return reply({"message" : 'Welcome! You shall receive in a few seconds a personal validation email with a link to folllow \
                           for changing your forgotten password!'}).code(200)})
        .catch(ex =>  { console.error( 'Error while attempting to send forgot password email for ' + escapedInputEmail + ' '+ ex);
                    return reply({"error" : "true", "message" : "Error while attempting to send forgot password email. \
                                 Verify the email you input an try again. "});
               })              
      }
      }catch (ex)  {
         console.error("", ex.message);
         return reply({
				error: true,
				errMessage: 'server-side error'
         });
      }  
    }
});

server.route(
{
	path: '/forgotPassword/{link}', 
	method: 'GET',
    config : {
      auth: false,
	  cors: {
		origin: _myConfig.my_origin,
		//credentials : true,
		additionalHeaders: ['cache-control', 'x-requested-with', 'accept-language', "Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type"]
      }
    },
	handler: async ( request, reply ) => {    
    try {
    
    var _linkReceived = request.params.link;
	var _escapedLink = (validator.escape(_linkReceived));
    
    console.log("forgot password validation link request received for link: " + _escapedLink );	 //todo : request.IPsource pour logguer
  	
    var myObjectLink= _commonsLinkHelpers.isLink(_escapedLink);
    if(!myObjectLink) {
		console.error("INVALID confirmation forgot password link: " + _escapedLink);
		return reply({error : true, message : 'Input is not a valid confirmation link. Attempt has been reported!'});
	}
    
    await MY_PLAYERS.validateForgotPasswordLink(_escapedLink, myObjectLink.email)
        .then(resolve => {
               var myURL = undefined;
               if (myObjectLink && myObjectLink.email) {
                  myURL= encodeURI(_myConfig.frontURL +'/login/resetPassword?email=' + myObjectLink.email + "&link=" + _escapedLink);
               }
         
              return reply('<!doctype html><html lang="fr">\
                           <head><meta charset="utf-8">\
                            <title>Great! Your forgotten password request is accepted!</title>\
                            <meta http-equiv="refresh" content="3;URL='+ myURL + '"' + '>\
                           </head>\
                            <body><h1>Hey there!</h1> \
                                  Wait a second, we take you to reset your passwords ... </body></html>'
                        ).code(200)
            }
        )
   
        
        .catch(ex =>  {
                console.error( 'Error while attempting to confirm forgot password email for ' + myObjectLink.email
                              + ' link part:' + myObjectLink.link   + ' '+ ex);
                return reply({error : true, message : 'The forgotten password link you provided is not valid. Ask for a new one to reset your password\
                             '}).code(422);
        })            
    }
    catch (ex)  {
	  console.error("", ex.message);
	  return reply({
				error: true,
				errMessage: 'server-side error'
        }).code(500);
	}        
    }
});

server.route(
{
	path: '/resetPassword',
	method: 'POST',
    config : {
		    auth : false,
    },
	handler: async ( request, reply ) => {        
 try {
	const { email, password, link } = request.payload;
	console.log("password reset order received for email: " + email + " link: " + link);	 //todo : request.IPsource pour logguer
	var escapedInputEmail = email===null?null : (validator.escape(email)).toLowerCase();
	console.log("escaped email to be checked: " + escapedInputEmail );
	
   var escapedLink = link===null?null:validator.escape(link);
   var examinedLink = _commonsLinkHelpers.isLink(escapedLink);
   
   if(escapedLink === null || (examinedLink.email !== escapedInputEmail)) {
		console.log(console,request,"INVALID REQUEST : email / link mismatch : email: " + escapedInputEmail + "\nLink:" + escapedLink);
		return reply({"error" : true , "message" : 'Input is not a valid email. '}).code(422); // Attempt should be reported in logs with IP source!
	}
   
    if(!validator.isEmail(escapedInputEmail)) {
		console.log(console,request,"INVALID EMAIL : escaped email : " + escapedInputEmail);
		return reply({"error" : true , "message" : 'Input is not a valid email. '}).code(422); // Attempt should be reported in logs with IP source!
	}
	else {
        console.log("email oK")
        if(!_commonsPasswordHelpers.passwordIsValid(password)) {
            console.log("password does not match requirred complexity");
            return reply({"error" : true , "message" : "password does not match required complexity"}).code(422);
        }
  
       
        MY_PLAYERS.resetPassword(escapedInputEmail, password, escapedLink)
        .then((wasPlayerFoundAndPasswordReset) =>
             {
               if(wasPlayerFoundAndPasswordReset === false) {
                  return reply({"error" : true , "message" : "password could not be reset for player: " + escapedInputEmail }).code(422);
               }
               else {
                  return reply({ "message" : 'Password reset succeeded! Now, close and log in!', email: escapedInputEmail}).code(200);
               }
             }
        )
        .catch ((ex) => {
            console.error('Player\'s password could not be reset!!?' + ex);
            return reply({"error" : true, "message" : 'We temporarily could not reset your password. \
                         Please try again in a few minutes.'}).code(500);
        })
	}
  } catch (ex)  {
	  console.error("ouch! ", ex.message, ex);
	  return reply({
				error: true,
				errMessage: 'server-side error'
	  });
	}}
});
console.log("Routes for auth plugin loaded");
}};

exports.register.attributes = {
	name : 'authPlugin',
	version : '1.0.0'
};
