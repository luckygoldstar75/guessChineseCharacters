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
            handler: ( request, reply ) => { try {
                const { email, password } = request.payload;
            console.log("password NEEDS to be checked: " + email +"/" +password);	 //todo : request.IPsource
            
            var ddb = new AWS.DynamoDB();
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
            
            console.log("before invocation of AWS.DynamoDB");
            ddb.getItem(params, function(err, data) {
              if (err) {  
                return reply({
                        error: true,
                        errMessage: err + ': Unable to read item'
                    });
              } else {
                
                if (data === undefined || data.Item === undefined) {
                    return reply({  
                        error: true,
                        errMessage: "LOGIN/PASSWORD NOT FOUND"
                    });
                }
                
                console.log("DATA: " + data );
                var _reply= JSON.stringify(data.Item);
                console.log("DATA: " + data + " REPLY: " +_reply);
                var mdpsale= data.Item["motDePasseSalé"].S;
                var sel= data.Item.sel.S;
                var saltedPasswordHash=SHA256(sel + password).toString();
                console.log("mdpsale: " + mdpsale + " sel: " +sel +  " saltedPasswordHash: " + saltedPasswordHash);
                console.log(typeof(mdpsale) + " " +  typeof(saltedPasswordHash));
                
                if(saltedPasswordHash !== mdpsale.toString()) {
                  return reply({  
                        error: true,
                        errMessage: "LOGIN/PASSWORD NOT FOUND"
                    });
                }
                else { // account and input password DO match ==> Register new session in db and memory
                  const token = jwt.sign({
                            escapedInputEmail,
                            scope: escapedInputEmail
                        }, _myConfig.server.privateKeyAuth, {
                            algorithm: _myConfig.server.authAlgo,
                            expiresIn: _myConfig.server.authExpiracyInHours
                        });
                  
                console.log("good password");
                
                //store New session in memory
                var expiryTimeForNewToken = Date.now() + _myConfig.server.authExpiracyInHours*3600*1000;
                      _myConfig.server.tableOfCurrentConnections.push({token : {user: escapedInputEmail, expiryTime : expiryTimeForNewToken}});
                               
                // Get last Session (OPTIONAL)
                var lastSession , nbGood =0, nbFalse=0;
                
                try {
                          lastSession =  SESSIONS.retrieveLastSession(request, reply, console, escapedInputEmail);
                          console.log("lastSession retrieved: ", lastSession);
                          
                          if (lastSession !== undefined) {
                            if (lastSession.nbFalse !== undefined) {
                              response.nbFalse = lastSession.nbFalse;
                            }
                            if (lastSession.nbGood !== undefined) {
                              response.nbGood = lastSession.nbGood;
                            }
                          }
                          else {
                            console.error("Could not update scores: update aws call returned object undefined");
                          }
                    }
                    catch (ex)  {
                          console.error("Exception triggered when attempting to store update score", ex.message);
                        }
                
                var params = {
                          TableName: 'my_sessions',
                          "ExpressionAttributeValues": {":escapedEmail" : {"S" : escapedInputEmail} },
                          "KeyConditionExpression": "email = :escapedEmail",
                          "Limit": 1,
                          ScanIndexForward: false
                        };

              ddb.query(params, function(err, data) { //WARN : TODO : GET ONLY the MAX timestamp session for user
                  if (err) {
                        console.log(err + ' Unable to read last session item');
                        
                        return reply({    
                          'token' : token,
                          'scope': escapedInputEmail
                          //add expiration?
                        });
                    } else if (data !== undefined && data.Items.length>=1) {
                      nbGood = data.Items[0].nbGood.N;
                      nbFalse = data.Items[0].nbFalse.N;

                       //sessions
                       var paramsStoreNewSession = {
                          TableName: 'my_sessions',
                          "Item" : {"email" : {"S" : escapedInputEmail},
                            "token" : {"S" : token},
                            "nbGood" : {"N" : nbGood},
                            "nbFalse" : {"N" : nbFalse},
                            "timestamp" : { "N" : (Date.now()).toString()}
                          }
                        };
                       
                       ddb.putItem(paramsStoreNewSession, function(err, data) { //WARN : TODO : GET ONLY the MAX timestamp session for user
                        if (err) {
                          console.log(err + ' Unable to put new session item');                          
                        } else {
                          console.log('put new session with token:' + token +  " :Success"); 
                        }
                                                
                        });
                        
                      return reply({    
                          'token' : token,
                          'scope': escapedInputEmail,
                          'nbGood': nbGood, 
                          'nbFalse' : nbFalse
                        });
                    }
              });
              

                }
                }   
               }       
    );} catch (ex)  {
              console.error("", ex.message);
              return reply({
                        error: true,
                        errMessage: 'server-side error'
              });		
            }}},
     {
        path: '/stats',
        method: 'GET',
        /*config: {
                auth: {
                    strategy: 'token',
                }},*/
        handler: ( request, reply ) => { try {
                        var docClient = new AWS.DynamoDB.DocumentClient();
                        var table = "sessions";

                      var params = {
                          TableName: table,
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
            path: '/guessCharacter', //TODO NOT BE PUT IN PRODUCTION
            method: 'POST',
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
                         var {id, userInputPinyin}=request.payload;
                         var myResult = false;
                         var charTobeGuessed = _myConfig.server.tableOfCurrentGuess[id];  //object like that set in GET guessCharacter             
                
                         console.log(JSON.stringify( _myConfig.server.tableOfCurrentGuess));
                         console.log("charTobeGuessed:" + charTobeGuessed);
                
                         if (charTobeGuessed !== undefined &&
                             CHINESE_CHARACTERS_JSON.table[charTobeGuessed.index].pinyin === userInputPinyin ) {
                           myResult = true;
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
                                           "isGood" : myResult};
                        
                        // try to update character
                        var scoresUpdated;
                        try {
                          scoresUpdated =  SESSIONS.update(request, reply, console, myResult);
                          console.log("scoresUpdated: ", scoresUpdated);
                          
                          if (scoresUpdated !== undefined) {
                            if (scoresUpdated.nbFalse !== undefined) {
                              response.nbFalse = scoresUpdated.nbFalse;
                            }
                            if (scoresUpdated.nbGood !== undefined) {
                              response.nbGood = scoresUpdated.nbGood;
                            }
                          }
                          else {
                            console.error("Could not update scores: update aws call returned object undefined");
                          }
                        }
                        catch (ex)  {
                          console.error("Exception triggered when attempting to store update score", ex.message);
                        }                        
                        
                        return reply(response).code(200);
                } catch (ex)  {
                    console.error("", ex.message);
                    reply( 'server-side error' ).code(500);		
                }
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
            var docClient = new AWS.DynamoDB.DocumentClient();
            var table = "sessions";
            
            var params = {
                TableName: table,
                Limit : 100,
                //Select : "COUNT"
            };
            
            docClient.scan(params, function(err, data) {
              if (err) {
                reply(err + ' Unable to read item');
              } else {
                var _reply= JSON.stringify(data);
                reply(_reply);
              }
            });
            
            //reply('Weird hello world! ==> u need 2 check what happened here!'); //.type('text/plain');
        }
    }    
    ];
    
    export default routes;
    
