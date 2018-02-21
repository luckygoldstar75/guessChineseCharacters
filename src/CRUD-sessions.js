'use strict';
import _myConfig from './config';
import AWS from 'aws-sdk';
import _log from './loggingTools';

const SESSIONS =
{
  __tableName : "my_sessions",
  updateScore : function (__token, __email, isGood, console, callback ) {
                      var ddb = new AWS.DynamoDB();
                      var targetCounter = ((isGood === true) ? "nbGood" : "nbFalse");
                      console.debug("targetCounter :", targetCounter );

                      console.debug("email: " + __email);

                      console.debug("TOKEN: " + __token);

                      if(__token === undefined || __email===undefined) {
                         callback("SESSION NOT FOUND ", null);
                         return;
                      }

                      var params = {
                          TableName: this.__tableName,
                          Key: {"email" : {S: __email},
							  "token" : {S: __token}
                          //"timestamp" : {N: "1517527485777"}
                          },
                          ExpressionAttributeNames : {
                            "#counter": targetCounter,
                            "#token" : "token"
                          },
                          ExpressionAttributeValues : {
                            ":ONE": {N : "1" },
                            ":token": {S : __token },
                          },
                          UpdateExpression: "add #counter :ONE",
                          ConditionExpression: "#token= :token",
                          ReturnValues : "ALL_NEW"
                        };
                    
                    var _reply= undefined;    
                    ddb.updateItem(params, async function(err, data) { //WARN : TODO : GET ONLY the MAX timestamp session for user
                      if (err) {
                        console.log(err + ': Unable to update item ' + err.stack);
                        callback("unable to update item in repository ", null);
                      } else {
                        var nbGood=data.Attributes.nbGood.N;
                        var nbFalse=data.Attributes.nbFalse.N;

                        console.debug("data " + JSON.stringify(data));
                        //console.debug("nbGood, nbFalse " + " " + nbGood + " " + nbFalse);
                        _reply = {'nbGood': nbGood, 'nbFalse' : nbFalse};
                        console.log("_reply " + JSON.stringify(_reply));
                        callback(null, _reply)                        
                      }
                    });
  },
retrieveLastSession : function (console, escapedInputEmail, callback) {
  var ddb = new AWS.DynamoDB();
  var params = {
            TableName: this.__tableName,
            "ExpressionAttributeValues": {":escapedEmail" : {"S" : escapedInputEmail} },
            "KeyConditionExpression": "email = :escapedEmail",
            "Limit": 1,
            ScanIndexForward: false
          };
  var _reply = undefined;
  
 ddb.query(params, function(err, data) {	 //WARN : TODO : CHECK THAT WE GET ONLY the MAX timestamp session for user
          if (err) { 
            console.error(err + ' Unable to read last session item ' + err.stack);
            callback(err, null);
           } 
          else if (data === undefined || data.Items === undefined || 
			data.Items.length<1 || data.Items[0].nbGood === undefined
			|| data.Items[0].nbFalse === undefined) {
            console.log('last session item empty or partly empty');
            callback(null, {})
         }
         else {
			 console.debug("data: " + JSON.stringify(data));
			 
			 _reply = {
            'token' : data.Items[0].token.S,
            'email': escapedInputEmail,
            'timestamp' : data.Items[0].timestamp.N,
            'nbGood' : data.Items[0].nbGood.N,
            'nbFalse' : data.Items[0].nbFalse.N,
            //add expiration?
            };
          
          console.debug("last session: " + JSON.stringify(_reply));
		  callback(null, _reply);
         }
  });
  },
create : function(escapedInputEmail, token, nbGood, nbFalse, callback)  {
  // TODO : shield input + try catch around + API contract : undefined vs value
           //sessions
if (nbGood === undefined) {nbGood = "0"};           
if (nbFalse === undefined) {nbFalse = "0"};

var ddb = new AWS.DynamoDB();
           var paramsStoreNewSession = {
              TableName: this.__tableName,	
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
              callback(err);
            } else {
              console.log('put new session with token:' + token +  " :Success");
              callback(null);
            }
            });
}
,
listSessions : function(callback)  {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: this.__tableName,
        Limit : 100,
        //Select : "COUNT"
    };

    docClient.scan(params, function(err, data) {
      if (err) {
        console.error(err + ' Unable to read item '+ err.stack);
        return callback(err, null);
      } else {
        var _reply= JSON.stringify(data);
        return callback(null, _reply);
      }
    });
}};
export default SESSIONS;
