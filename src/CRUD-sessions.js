'use strict';
import _myConfig from './config';
import AWS from 'aws-sdk';
import _log from './loggingTools';

const SESSIONS =
{
  __tableName : "my_sessions",
 
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
            'sessionId' : data.Items[0].sessionId.S,
            'email': escapedInputEmail,
            'timestamp' : data.Items[0].timestamp.S
            //add expiration?
            };
          
          console.debug("last session: " + JSON.stringify(_reply));
		  callback(null, _reply);
         }
  });
  },
create : function(escapedInputEmail, sessionId, callback)  {
  // TODO : shield input + try catch around + API contract : undefined vs value
           //sessions

var ddb = new AWS.DynamoDB();
           var paramsStoreNewSession = {
              TableName: this.__tableName,	
              "Item" : {"email" : {"S" : escapedInputEmail},
                "sessionId" : {"S" : sessionId},
                "timestamp" : { "S" : (Date.now()).toString()}
              }
            };

ddb.putItem(paramsStoreNewSession, function(err, data) { //WARN : TODO : GET ONLY the MAX timestamp session for user
            if (err) {
              console.log(err + ' Unable to put new session item');
              callback(err);
            } else {
              console.log('put new session with sessionId:' + sessionId +  " :Success");
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
