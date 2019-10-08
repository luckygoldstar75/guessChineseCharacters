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
 
 
create : function(escapedInputEmail, password, escapedInputAvatar, escapedInputPseudo,
                  signupLink, signupLinkExpiracyTimestamp,isTemporaryAccountNeedingSignupValidation)  {
  // TODO : shield input + try catch around + API contract : undefined vs value
var ddb = new AWS.DynamoDB();
           var salt = crypto.randomBytes(Math.ceil(16)).toString(); 
           var saltedPassword = SHA256(salt + password).toString();
           var nowtmstmp = Date.now().toString();
                                      
           var paramsStoreNewPlayer = {
              TableName: this.__tableName,	
              "Item" : {"email" : {"S" : escapedInputEmail},
                "avatarUrl" : {"S" : escapedInputAvatar},
                "saltedPassword" : {"S" : saltedPassword},
                "salt" : {"S" : salt},
                "pseudo" : { "S" : escapedInputPseudo},
                "signupLink" : { "S" : signupLink},
                "signupLinkExpiracyTimestamp" : {"N" : signupLinkExpiracyTimestamp},
                "signupConfirmationNeeded" : {"BOOL" : isTemporaryAccountNeedingSignupValidation},
                "forgottenPasswordLink" : { "S" : 'N/A'},
                "forgottenPasswordLinkExpiracyTimestamp" : {"N" : nowtmstmp},
                "hasForgottenPassword" : {"BOOL" : false},
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


renewForgotPasswordConfirmationLink : async function (_escapedInputEmail,  _link, _linkExpiracyTimestamp) {
  var ddb = new AWS.DynamoDB.DocumentClient();
  var params = {
            TableName: MY_PLAYERS.__tableName,
            "ExpressionAttributeValues":
            { ":_link" : _link,
              ":_linkExpiracyTimestamp" : _linkExpiracyTimestamp,
              ":_true" : true,
            },
            "Key": {"email" : _escapedInputEmail},
            "UpdateExpression" : "set forgottenPasswordLink = :_link , forgottenPasswordLinkExpiracyTimestamp = :_linkExpiracyTimestamp, \
                                                              hasForgottenPassword = :_true",
            "ReturnValues" : "UPDATED_NEW", 
            "ScanIndexForward": false 
          };     
 return await ddb.update(params).promise().then( data => {
   if (data === undefined || data.Attributes === undefined || 
			Object.keys(data.Attributes).length<1 ) {
            console.log('no row updated for forgot password request ' + _escapedInputEmail);
            return new Promise((resolve, reject) => { resolve(false);});
         }
         else {
          console.log('forgot password link renewed for player with email ' + _escapedInputEmail);
           return new Promise((resolve, reject) => {resolve(true);});
         }
  }).catch(err => {console.error(err + ' Unable to issue forgot password confirmation link ' + err + err.stack);
           return new Promise((resolve, reject) => {reject(err);})});
 },
 
 
 sendEmailForForgotPassword : async function (console, sourceEmail, escapedInputEmail, link) {
  var ses = new AWS.SES();
  var body = 'Bonjour 你好,\n Voici le lien qui vous permettra de mettre à jour votre mot de passe: ' +
  link + '\n\nNB: Le lien est valable 2 heures \n.'
  + '\n\nBien à vous,\nl\'équipe de j\'apprends le chinois en jouant.\n\n好好';
  var params = {
    Source: sourceEmail,
    Destination: {
      ToAddresses: [escapedInputEmail]
    },
    Message: {
      Subject: {
        Data: 'Forgot password request'
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


renewSignupConfirmationLink : async function (_escapedInputEmail,  _link, _linkExpiracyTimestamp) {
  var nowtmstmp = parseInt(Date.now().toString(), 10);
  var ddb = new AWS.DynamoDB.DocumentClient();
  var params = {
            TableName: MY_PLAYERS.__tableName,
            "ExpressionAttributeValues":
            { ":_link" : _link,
              ":_linkExpiracyTimestamp" : _linkExpiracyTimestamp,
              ":_true" : true,
            },
            "Key": {"email" : _escapedInputEmail},
            "UpdateExpression" : "set signupLink = :_link , signupLinkExpiracyTimestamp = :_linkExpiracyTimestamp",
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
 },
 
 
 sendEmailForSignupConfirmation : async function (console, sourceEmail, escapedInputEmail, link) {
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



validateSignupLink : async function (_receivedLink, _validEmail) {
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
            "ConditionExpression": "signupLink = :_link AND signupConfirmationNeeded = :_true AND signupLinkExpiracyTimestamp > :_now",
            "UpdateExpression" : "set signupConfirmationNeeded = :_false",
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
 },
 
 validateForgotPasswordLink : async function (_receivedLink, _validEmail) {
  var nowtmstmp = parseInt(Date.now().toString(), 10);
  console.log("nowtmstmp", nowtmstmp);
  var ddb = new AWS.DynamoDB.DocumentClient();
  var params = {
            TableName: MY_PLAYERS.__tableName,
            "ExpressionAttributeValues":
            { ":_link" : _receivedLink,
              ":_now" : nowtmstmp,
              ":_true" : true,
                
            },
            "Key": {"email" : _validEmail},
            "UpdateExpression" : "set hasForgottenPassword = :_true",
            "ConditionExpression": "forgottenPasswordLink = :_link AND hasForgottenPassword = :_true AND forgottenPasswordLinkExpiracyTimestamp > :_now",
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
          console.log('forgot password link found for player with email ' + _validEmail);
           return new Promise((resolve, reject) => {resolve(true);});
         }
  }).catch(err => {console.error(err + ' Unable to retrieve forgot password confirmation link ' + err + err.stack);
           return new Promise((resolve, reject) => {reject(err);})});
 },
 
 
 resetPassword : async function (escapedInputEmail, password, escapedLink) {
  var nowtmstmp = parseInt(Date.now().toString(), 10);
  console.log("nowtmstmp", nowtmstmp);
  var salt = crypto.randomBytes(Math.ceil(16)).toString() ; 
  var saltedPassword = SHA256(salt + password).toString();
 
 
  var ddb = new AWS.DynamoDB.DocumentClient();
  var params = {
            TableName: MY_PLAYERS.__tableName,
            "ExpressionAttributeValues":
            { ":_now" : nowtmstmp,
             ":_password" : saltedPassword,
              ":_salt" : salt,
              ":_link" : escapedLink,
              ":_false" : false,
              ":_true" : true
            },
            "Key": {"email" : escapedInputEmail},
            "ConditionExpression": "forgottenPasswordLink = :_link AND hasForgottenPassword = :_true \
                    AND forgottenPasswordLinkExpiracyTimestamp > :_now",
            "UpdateExpression" : "set saltedPassword = :_password , salt=:_salt, hasForgottenPassword = :_false",
            "ReturnValues" : "UPDATED_NEW",
            "ScanIndexForward": false
          };
     
 return await ddb.update(params).promise().then( data => {
   if (data === undefined || data.Attributes === undefined || 
			Object.keys(data.Attributes).length<1 ) {
            console.log('email not found for email ' + escapedInputEmail);
            return new Promise((resolve, reject) => { resolve(false);});
         }
         else {
          console.log('password was reset for email ' + escapedInputEmail);
           return new Promise((resolve, reject) => {resolve(true);});
         }
  }).catch(err => {console.error(err + ' Unable to reset password ' + err + err.stack);
           return new Promise((resolve, reject) => {reject(err);})});
 }
 
};

export default MY_PLAYERS;
