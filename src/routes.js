    import jwt from 'jsonwebtoken';
    import _myConfig from './config';
    import validator from 'validator';
    import _log from './loggingTools';
    import inert from 'inert';
    import CHINESE_CHARACTERS_JSON from './chineseCaracters.js';
    import SESSIONS from './CRUD-sessions.js';
    var SHA256 = require("crypto-js/sha256");

    const routes = [
    {
        path: '/',
        method: 'GET',
        handler: ( request, reply ) => {
			if (request.auth.isAuthenticated) {
					reply.file('./devineLesCaracteres.html'); //.type('text/plain');
			}
			else {	
				return h.redirect('/login');	
			}
            
        }
    },
    {
        path: '/hello',
        method: 'GET',
        handler: ( request, reply ) => {
            reply('hello world'); //.type('text/plain');
        }
    },
    {
            path: '/validEmail', //TODO: not in production
            method: 'POST',
            handler: ( request, reply ) => { try {
                const { email } = request.payload;
            console.log("email check request received: " + email );	 //todo : request.IPsource pour logguer
            var escapedInputEmail = (validator.escape(email)).toLowerCase();
            console.log("escaped email to be checked: " + escapedInputEmail );
            if(!validator.isEmail(escapedInputEmail)) {
                _log.logging(console,request,"INVALID EMAIL : escaped email : " + escapedInputEmail);
                return reply('Input is not a valid email. Attempt has been reported!');
            }
            else {
                return reply('validEmail !');
            }
      } catch (ex)  {
              console.error("", ex.message);
              return reply({
                        error: true,
                        errMessage: 'server-side error'
              });
            }}
    },
  ,
     {
        path: '/stats', // NOT FUNCTIONAL : SERVER SIDE ERRORS : REDEFINE PURPOSE!!!!
        method: 'GET',
        handler: ( request, reply ) => { try {
                      var docClient = new AWS.DynamoDB.DocumentClient();

                      var params = {
                          TableName: "my_sessions",
                          ExpressionAttributeValues : {
                          ':token' : {S : request.auth.credentials.token  }
                          },
                          KeyConditionExpression: 'token = :token',
                          "Limit": 1,
                          ScanIndexForward: false
                        };

                    docClient.get(params, function(err, data) { //WARN : TODO : GET ONLY the MAX timestamp session for user
                      if (err) {
                        reply(err + ' Unable to read item');
                      } else {
                        var {nbGood, nbFalse}=data;
                        var _reply = {'nbGood': nbGood, 'nbFalse' : nbFalse};
                        reply(JSON.stringify(_reply));
                      }
                    });
                } catch (ex)  {
            console.error("", ex.message);
                    reply( 'server-side error' ).code(500);
                }
        }
    },
    {
            path: '/guessCharacter',
            method: 'GET',
            config : {
		      auth: {
                    strategy: 'standard'                    
                }, 
			  cors: {
				origin: ['http://localhost:3000'],
				credentials : true,
				additionalHeaders: ['cache-control', 'x-requested-with', 'accept-language', "Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type"]
		      }
		    },            
            handler: ( request, reply ) => { try {
                       console.log("new call to: " + request.method + " " + request.path  +
                                " with params " + ((request.params === null)? undefined: JSON.stringify(request.params)) +
                                " and payload " + ((request.payload === null)? undefined: JSON.stringify(request.payload)) +
                                " and scope credentials: " + request.auth.credentials.scope);
                         var indexHasard=Math.floor((Math.random() * CHINESE_CHARACTERS_JSON.table.length));
                         var myCar = CHINESE_CHARACTERS_JSON.table[indexHasard].caracter;
                         var myUniqueGuessId=_myConfig.guid();
                         console.log(myUniqueGuessId);
                         var guessItem = { "id": myUniqueGuessId ,"character" : myCar,
                                                  "timestamp" : Date.now()};
                         var stringGuessItem = JSON.stringify(guessItem);
                         guessItem.index = indexHasard;
                        _myConfig.server.tableOfCurrentGuess[myUniqueGuessId]=guessItem;
                        return reply(stringGuessItem).code(200);
                } catch (ex)  {
            console.error("", ex.message);
                    reply( 'server-side error' ).code(500);
                }
        }

    },
        {
            path: '/guessCharacter', 
            method: 'POST',
            config: {
                auth: {
                    strategy: 'standard',
                }
            },  //TODO : how to fo it for simple visitors / no account?
            handler: async ( request, reply ) => { try {
                       console.log("new call to: " + request.method + " " + request.path  +
                                " with params " + ((request.params === null)? undefined: JSON.stringify(request.params)) +
                                " and payload " + ((request.payload === null)? undefined: JSON.stringify(request.payload)) +
                                " and scope credentials: " + request.auth.credentials.scope);
                         var {id, userInputPinyin}=request.payload;
                         
                         if(_myConfig.server.tableOfCurrentGuess[id] === null || _myConfig.server.tableOfCurrentGuess[id] === undefined) {
							 console.log("_myConfig.server.tableOfCurrentGuess[id]: " + JSON.stringify(_myConfig.server.tableOfCurrentGuess));
							 return reply({
									error: true,
									errMessage: "guess : id " + id + " not found"
							});
						}
                         
                         var isGood = false;
                         var charTobeGuessed = _myConfig.server.tableOfCurrentGuess[id];  //object set in GET guessCharacter
						 if (charTobeGuessed !== undefined || charTobeGuessed !== undefined) { // the guess is now to be erased : it has been tested for guess once
							delete _myConfig.server.tableOfCurrentGuess[id];
						 }
                         console.log(JSON.stringify( _myConfig.server.tableOfCurrentGuess));
                         console.log("charTobeGuessed:" + charTobeGuessed);

                         if (charTobeGuessed !== undefined &&
                             CHINESE_CHARACTERS_JSON.table[charTobeGuessed.index].pinyin === userInputPinyin ) {
                           isGood = true;
                         }
                        else {
                          var _myCharacter = {};
                          if (charTobeGuessed !== undefined) {
                            _myCharacter= CHINESE_CHARACTERS_JSON.table[charTobeGuessed.index];
                          }

                          console.log("Wrong inputCharacter, user made a mistake " +
                                          _myCharacter.caracter + " is in pinyin: " + _myCharacter.pinyin + " VS user input pinyin:" + userInputPinyin );
                        }

                        var response = {"id": id,
                                           "isGood" : isGood,
                                           "answer" : CHINESE_CHARACTERS_JSON.table[charTobeGuessed.index].pinyin};

                        // try to update session with score
                        try {
                          var __sid=request.state['authsid'].sid;
                          var __email=null;    
                          request.server.app.cacheSession.get(__sid, (err, value, cached, log) => {
									  if(err) {
										  console.error("could not get session sid in cache: " + err )
										}
									  else {										  
										  __email=value.email;
										  console.log("Success: get session sid in cache: " + __email);
										  SESSIONS.updateScore(__sid, __email, isGood, console, getResult);
										  }
								  });
                          
                          function printData(data, depth) {
							    if (depth === 0)
									return data;
							    
							    var str = '';
							    for (var key in data) {
										          if (typeof data[key] == 'object') str += key + printData(data[key], depth -1) + ' ';
										                 else str += key + ' => ' + data[key] + ' ';
								}
								return str;
						  };
                          
                          console.debug("__sid: " + __sid);
                          //console.debug("request.server.app.cacheSession: " + printData(request.server.app.cacheSession, 2) + " request.server.app.cacheSession.get(__sid): " + request.server.app.cacheSession.get(__sid));
                          console.debug("after print session");
                          
                          function getResult(err, _scoresUpdated) {
							console.debug("_scoresUpdated: " + _scoresUpdated);
							if (_scoresUpdated !== undefined && _scoresUpdated !== null && _scoresUpdated.error === undefined 
									&& _scoresUpdated.nbFalse !== undefined && _scoresUpdated.nbGood !== undefined) {
									response.nbFalse = _scoresUpdated.nbFalse;
									response.nbGood = _scoresUpdated.nbGood;							
							}
							
                            if (err !== undefined && err !== null) {
								console.warn("error : " + err + err.stack);
								console.warn("Could not update scores: update aws call returned object undefined");
								console.warn("response:" + response);
								response.error="technical error : scores could not be updated";
								console.warn("response:" + response);
							}
							
                          };	
                          
                          
                        }
                        catch (ex)  {
						  response.error="technical error : scores could not be updated";	
                          console.error("Exception triggered when attempting to store update score:", ex.message);
                        }
                        finally {
							console.debug("here am i: " + response);
							for (var key in response) {
								console.debug("key:" + key + " value" + response[key]) ;
							}
							
                          return reply(response).code(200);
						}
                } catch (ex)  {
                    console.error("", ex.message);
                    reply( 'server-side error' ).code(500);
                }
        }
    },
    { // TO BE REMOVE IN PRODUCTION MODE
        path: '/dumRetrieveLastSession',
        method: 'GET',
        handler: async ( request, reply ) => {
			function getResult(err, myLastSession) {
				if (err !== undefined && err !== null) {
					console.log("error : " + err);
					return reply(err).code(400);
				}
				else {
					console.debug("myLastSession: " + myLastSession);
					return reply(myLastSession).code(200);	
				}	
			}			
            SESSIONS.retrieveLastSession(console, "japprends.le.chinois.en.jouant@gmail.com", getResult);
        }
    },
    {
            path: '/privacyCheckTestService', //TODO NOT BE PUT IN PRODUCTION
            method: 'GET',
            /*config: {
                auth: {
                    strategy: 'token',
                }
            },*/ //TODO : neccessary or not ?
            handler: ( request, reply ) => { try {
                    console.log("new call to: " + request.method + " " + request.path  +
                                " with params " + ((request.params === null)? undefined: JSON.stringify(request.params)) +
                                " and payload " + ((request.payload === null)? undefined: JSON.stringify(request.payload)) +
                                " and scope credentials: " + request.server.app.cache.get(request.state['sid'].sid.email));
                        return reply('valid token').code(200);
                } catch (ex)  {
            console.error("", ex.message);
                    return reply( 'server-side error' ).code(500);
                }
        }

    },
    {
        path: '/listSessions',
        method: 'GET',
        handler: ( request, reply ) => {
			function callback(err, _reply) {
				if (err === null) {
					reply(_reply).code(200);
				}
				else {
						return reply({level: ERROR,
							errMessage: "sessions could not be retrieved: "}).code(400);
				}
				
			}
			
            SESSIONS.listSessions(callback);
            //reply('Weird hello world! ==> u need 2 check what happened here!'); //.type('text/plain');
        }
    }
    ];

    export default routes;
