'use strict';
import _myConfig from './config';
import AWS from 'aws-sdk';
import _log from './loggingTools';
import crypto from "crypto";

var SHA256 = require("crypto-js/sha256");


const MY_PLAYERS =
{
  __tableName : "my_players",

doesPlayerExistByEmail : async function (console, escapedInputEmail) {
  var ddb = new AWS.DynamoDB();
  var params = {
            TableName: MY_PLAYERS.__tableName,
            "ExpressionAttributeValues": {":escapedEmail" : {"S" : escapedInputEmail} },
            "KeyConditionExpression": "email = :escapedEmail",
            "Limit": 1,
            ScanIndexForward: false
          };
     
 return await ddb.query(params).promise().then( data => {
   if (data === undefined || data.Items === undefined || 
			data.Items.length<1 ) {
            console.log('player not found with email ' + escapedInputEmail);
            return new Promise((resolve, reject) => { resolve(false);});
         }
         else {
          console.log('player found with email ' + escapedInputEmail);
           return new Promise((resolve, reject) => {resolve(true);});
         }
  }).catch(err => {console.error(err + ' Unable to read player ' + err + err.stack);
           return new Promise((resolve, reject) => {reject(err);})});
 }, 


create : function(escapedInputEmail, password, escapedInputAvatar, escapedInputPseudo, link, linkExpiracyTimestamp,
                  isTemporaryAccountNeedingSignupValidation)  {
  // TODO : shield input + try catch around + API contract : undefined vs value
var ddb = new AWS.DynamoDB();
           var salt = crypto.randomBytes(Math.ceil(16)).toString() ; 
           var saltedPassword = SHA256(salt + password).toString();
                                      
           var paramsStoreNewPlayer = {
              TableName: this.__tableName,	
              "Item" : {"email" : {"S" : escapedInputEmail},
                "avatarUrl" : {"S" : escapedInputAvatar},
                "motDePasseSalé" : {"S" : saltedPassword},
                "sel" : {"S" : salt},
                "pseudo" : { "S" : escapedInputPseudo},
                "link" : { "S" : link},
                "linkExpiracyTimestamp" : {"S" : linkExpiracyTimestamp.toString()},
                "signupConfirmationNeeded" : {"BOOL" : isTemporaryAccountNeedingSignupValidation}
              }
            };

ddb.putItem(paramsStoreNewPlayer, function(err, data) {
            if (err) {
              console.log(err + ' Unable to put new player');
              throw(err);
            } else {
              console.log('put new player with email:' + escapedInputEmail +  " :Success");
            }
            });
},
renewSignupConfirmationLink : async function (_escapedInputEmail,  _linkExpiracyTimestamp) {
  var nowtmstmp = Date.now().toString();
  var ddb = new AWS.DynamoDB.DocumentClient();
  var params = {
            TableName: MY_PLAYERS.__tableName,
            "ExpressionAttributeValues":
            { ":_link" : _link,
              ":_linkExpiracyTimestamp" : _linkExpiracyTimestamp,
              ":_true" : true,
            },
            "Key": {"email" : _escapedInputEmail},
            "UpdateExpression" : "set link = :_link , linkExpiracyTimestamp = :_linkExpiracyTimestamp",
            "ConditionExpression": "signupConfirmationNeeded = :_true",
            "ReturnValues" : "UPDATED_NEW", 
            "ScanIndexForward": false 
          };
     
 return await ddb.update(params).promise().then( data => {
   if (data === undefined || data.Attributes === undefined || 
			Object.keys(data.Attributes).length<1 ) {
            console.log('no row updated for email signup link renewal request ' + _escapedInputEmail);
            return new Promise((resolve, reject) => { resolve(false);});
         }
         else {
          console.log('signup confirmation link renewed for player with email ' + _escapedInputEmail);
           return new Promise((resolve, reject) => {resolve(true);});
         }
  }).catch(err => {console.error(err + ' Unable to renew signup confirmation link ' + err + err.stack);
           return new Promise((resolve, reject) => {reject(err);})});
 }
, sendEmailForSignupConfirmation : async function (console, sourceEmail, escapedInputEmail, link) {
  var ses = new AWS.SES();
  var body = 'Bonjour et bienvenue 你好,\n Voici le lien de confirmation que vous avez demandé: ' +
  link + '\n\nVotre inscription sera validée lorsque vous aurez confirmé en suivant le lien. Le lien est valable 2 heures \n.'
  + '\n\nBien à vous,\nl\'équipe de j\'apprends le chinois en jouant.\n\n好好';
  var params = {
    Source: sourceEmail,
    Destination: {
      ToAddresses: [escapedInputEmail]
    },
    Message: {
      Subject: {
        Data: 'Confirmation Subscription Email '
      },
      Body: {
        Text: {
          Data: body
        }
      }
    }
  };
     
 return await ses.sendEmail(params).promise();
},

validateLink : async function (_receivedLink, _validEmail) {
  var nowtmstmp = parseInt(Date.now().toString(), 10);
  console.log("nowtmstmp", nowtmstmp);
  var ddb = new AWS.DynamoDB.DocumentClient();
  var params = {
            TableName: MY_PLAYERS.__tableName,
            "ExpressionAttributeValues":
            { ":_link" : _receivedLink,
              ":_now" : nowtmstmp,
              ":_false" : false,
              ":_true" : true,
                
            },
            "Key": {"email" : _validEmail},
            "UpdateExpression" : "set signupConfirmationNeeded = :_false",
            "ConditionExpression": "link = :_link AND signupConfirmationNeeded = :_true AND linkExpiracyTimestamp > :_now",
            "ReturnValues" : "UPDATED_NEW",
            "ScanIndexForward": false
          };
     
 return await ddb.update(params).promise().then( data => {
   if (data === undefined || data.Attributes === undefined || 
			Object.keys(data.Attributes).length<1 ) {
            console.log('link ' + _receivedLink + '  not found for email ' + _validEmail);
            return new Promise((resolve, reject) => { resolve(false);});
         }
         else {
          console.log('signup confirmation link found for player with email ' + _validEmail);
           return new Promise((resolve, reject) => {resolve(true);});
         }
  }).catch(err => {console.error(err + ' Unable to retrieve signup confirmation link ' + err + err.stack);
           return new Promise((resolve, reject) => {reject(err);})});
 }
};

export default MY_PLAYERS;
