    import jwt from 'jsonwebtoken';
    import _myConfig from './config';
    import AWS from 'aws-sdk';
    import validator from 'validator';
    import _log from './loggingTools';
    import inert from 'inert';
    import CHINESE_CHARACTERS_JSON from './chineseCaracters.js';
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
            
            var dbPlayers = new AWS.DynamoDB();
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
            dbPlayers.getItem(params, function(err, data) {
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
                        } );
                  
                console.log("good password");
                
                //store New session in memory
                var expiryTimeForNewToken = Date.now() + _myConfig.server.authExpiracyInHours*3600*1000;
                      _myConfig.server.tableOfCurrentConnections.push({token : {user: escapedInputEmail, expiryTime : expiryTimeForNewToken}});
                
                
                
                // Get last Session (OPTIONAL)
                var nbGood =0, nbFalse=0;
               var params = {
                          TableName: 'sessions',
                          "ExpressionAttributeValues": {":escapedEmail" : {"S" : escapedInputEmail} },
                          "KeyConditionExpression": "email = :escapedEmail",
                          "Limit": 1,
                          ScanIndexForward: false
                        };

              dbPlayers.query(params, function(err, data) { //WARN : TODO : GET ONLY the MAX timestamp session for user
                  if (err) {
                        console.log(err + ' Unable to read last session item');
                        
                        return reply({    
                          'token' : token,
                          'scope': escapedInputEmail
                        });
                    } else if (data !== undefined && data.Items.length>=1) {
                      nbGood = data.Items[0].nbGood.N;
                      nbFalse = data.Items[0].nbFalse.N;

                       //sessions
                       var paramsStoreNewSession = {
                          TableName: 'sessions',
                          "Item" : {"email" : {"S" : escapedInputEmail},
                            "token" : {"S" : token},
                            "nbGood" : {"N" : nbGood},
                            "nbFalse" : {"N" : nbFalse},
                            "timestamp" : { "N" : (Date.now()).toString()}
                          }
                        };
                       
                       dbPlayers.putItem(paramsStoreNewSession, function(err, data) { //WARN : TODO : GET ONLY the MAX timestamp session for user
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
        config: {
                auth: {
                    strategy: 'token',
                }},
        handler: ( request, reply ) => { try {
                    if (request.auth.credentials.token in _myConfig.server.tableOfCurrentConnections) {
                        console.log("get stats for user with valid token: value : " + request.auth.credentials.token + " and username " +_myConfig.server.tableOfCurrentConnections[token].user);
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
                    }
                    else  {
                        if (request.auth.credentials.token === undefined) {
                        console.log("user without token: value : " + request.auth.credentials.token);
                        }
                        else  {
                        console.log("user with INVALID token: value : " + request.auth.credentials.token);
                        }
                        
                        reply('invalid token'.code(401));                
                    }
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
                 if (request.auth.credentials.token in _myConfig.server.tableOfCurrentConnections) {
                        console.log("new call to: " + method + " " + path  + " for user with valid token: value : " + request.auth.credentials.token + " and username " +_myConfig.server.tableOfCurrentConnections[token].user);
                         var indexHasard=Math.floor((Math.random() * caracteres.length));
                         var myCar = CHINESE_CHARACTERS_JSON.table[indexHasard].caracter;
                         var myUniqueGuessId=_myConfig.guid();
                         var guessItem = { myUniqueGuessId : {"character" : myCar,
                                                  "timestamp" : Date.now()}};
                         tableOfCurrentGuess.push(guessItem);
                         var stringGuessItem = JSON.stringify(guessItem);
                        return reply(stringGuessItem).code(200);
                    }
                    else  {
                        if (request.auth.credentials.token === undefined) { //todo : request.IPsource
                        console.log("new Test for user without token: value : " + request.auth.credentials.token);
                        // what do we do here ? would be nice to allow prospect play and invite to sign up
                        }
                        else  {
                        console.log("new attempt for user with INVALID token: value : " + request.auth.credentials.token); //todo : log request.IPsource
                        }
                        
                        reply('invalid token').code(401);                
                    }
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
                    if (request.auth.credentials.token in _myConfig.server.tableOfCurrentConnections) {
                        console.log("new Test for user with valid token: value : " + request.auth.credentials.token + " and username " +_myConfig.server.tableOfCurrentConnections[token].user);
                        return reply('valid token'.code(200));
                    }
                    else  {
                        if (request.auth.credentials.token === undefined) {
                        console.log("new Test for user without token: value : " + request.auth.credentials.token);
                        }
                        else  {
                        console.log("new Test for user with INVALID token: value : " + request.auth.credentials.token);
                        }
                        
                        return reply('invalid token').code(401);                
                    }
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
            var email = "japprends.le.chinois.en.jouant@gmail.com";
            
            var params = {
                TableName: table,
                Key:{
                "email": email,
                "timeStampStart": "1516226874"
                }
            };
            
            docClient.get(params, function(err, data) {
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
    
