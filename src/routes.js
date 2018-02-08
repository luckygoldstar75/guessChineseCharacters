    import jwt from 'jsonwebtoken';
    import _myConfig from './config';
    import AWS from 'aws-sdk';
    import validator from 'validator';
    import _log from './loggingTools';
    import inert from 'inert';
    import CHINESE_CHARACTERS_JSON from './chineseCaracters.js';
    import SESSIONS from './CRUD-sessions.js';
    var SHA256 = require("crypto-js/sha256");

    AWS.config.update({
      accessKeyId: "AKIAI25TDQD76X2NL3QQ",
      secretAccessKey: "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",
      region: "us-east-1",
      httpOptions: {timeout: 500}
  });

    const routes = [
    {
        path: '/',
        method: 'GET',
        handler: ( request, reply ) => {
            reply.file('./devineLesCaracteres.html'); //.type('text/plain');
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
            console.log("email check request received: " + email );	 //todo : request.IPsource
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
    {
            path: '/auth',
            method: 'POST',
            handler: async ( request, reply ) => { try {
                const { email, password } = request.payload;
            console.debug("password NEEDS to be checked: " + email +"/" + password);	 //todo : request.IPsource

            var ddb = new AWS.DynamoDB();

            //EMAIL VALIDATION
            var escapedInputEmail = (validator.escape(email)).toLowerCase();

            if(!validator.isEmail(escapedInputEmail)) {
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
                console.debug(typeof(mdpsale) + " " +  typeof(saltedPasswordHash));

                if(saltedPasswordHash !== mdpsale.toString()) {
                  return reply({
                        error: true,
                        errMessage: "LOGIN/PASSWORD NOT FOUND"
                    });
                }
                else { // account and input password DO match ==> Now : Register new session in db and memory
                  const token = jwt.sign({
                            escapedInputEmail,
                            scope: escapedInputEmail
                        }, _myConfig.server.privateKeyAuth, {
                            algorithm: _myConfig.server.authAlgo,
                            expiresIn: _myConfig.server.authExpiracyInHours
                        });

                console.debug("good password");

                //store New session in memory
                var expiryTimeForNewToken = Date.now() + _myConfig.server.authExpiracyInHours*3600*1000;
                      _myConfig.server.tableOfCurrentConnections.push({token : {user: escapedInputEmail, expiryTime : expiryTimeForNewToken}});

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
                          
                        storeNewSession(escapedInputEmail,token , nbGood , nbFalse);  	
                    }	
					
					SESSIONS.retrieveLastSession(console, escapedInputEmail, getResult);    
                 }
                 catch (ex)  {
                          console.error("Exception triggered when attempting to store update score : ", ex.message);
                 }
                
                function storeNewSession(_escapedInputEmail,_token , _nbGood , _nbFalse) {  	
                //STORE NEW SESSION TO DB (NOT ESSENTIAL : can play on memory but scores not updated in DB)
                 try {
					 
				  console.log("_escapedInputEmail, _token, _nbGood, _nbFalse: " + _escapedInputEmail +"," + _token + "," + _nbGood + "," + _nbFalse);
				  var response = {
                            'token' : _token,
                            'scope': _escapedInputEmail,
                            'nbGood': _nbGood,
                            'nbFalse' : _nbFalse
                          };
				
				  function _afterCreate(err) {	
					  if (err !== null) {
							response.err="WARN_SESSION_COULD_NOT_BE_SAVED_TO_DB";
						}
					   return reply(response);							
					  }	
					
                  SESSIONS.create(_escapedInputEmail, _token, _nbGood, _nbFalse, _afterCreate);                  
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
              console.error("", ex.message);
              return reply({
                        level: ERROR,
                        message: 'server-side error'
				});
		  }
	}},
     {
        path: '/stats', // NOT FNCTIONAL : SERVER SIDE ERRORS : REDEFINE PURPOSE!!!!
        method: 'GET',
        /*config: {
                auth: {
                    strategy: 'token',
                }},*/
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
            path: '/guessCharacter', //TODO NOT BE PUT IN PRODUCTION
            method: 'GET',
            config: {
                auth: {
                    strategy: 'token',
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
            path: '/guessCharacter', //TODO NOT BE PUT IN PRODUCTION : id must be grilled when used
            method: 'POST',
            config: {
                auth: {
                    strategy: 'token',
                }
            },
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
                                           "isGood" : isGood};

                        // try to update session with score
                        try {
                          var __auth=request.headers.authorization;
                          var __email=request.auth.credentials.scope;
                          
                          function getResult(err, _scoresUpdated) {
                            if (err !== undefined && err !== null) {
								console.error("error : " + err + err.stack);
							}
							else {
								console.debug("_scoresUpdated: " + _scoresUpdated);
								if (_scoresUpdated !== undefined && _scoresUpdated.error === undefined 
									&& _scoresUpdated.nbFalse !== undefined && _scoresUpdated.nbGood !== undefined) {
									response.nbFalse = _scoresUpdated.nbFalse;
									response.nbGood = _scoresUpdated.nbGood;							
								}
								else {
									console.warn("Could not update scores: update aws call returned object undefined");
								}
								
								return reply(response).code(200);	
							}	
                          };	
                          
                          SESSIONS.updateScore(__auth, __email, isGood,console, getResult);
                        }
                        catch (ex)  {
                          console.error("Exception triggered when attempting to store update score", ex.message);
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
            config: {
                auth: {
                    strategy: 'token',
                }
            },
            handler: ( request, reply ) => { try {
                    console.log("new call to: " + request.method + " " + request.path  +
                                " with params " + ((request.params === null)? undefined: JSON.stringify(request.params)) +
                                " and payload " + ((request.payload === null)? undefined: JSON.stringify(request.payload)) +
                                " and scope credentials: " + request.auth.credentials.scope);
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
