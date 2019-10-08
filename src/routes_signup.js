"use strict";

import _myConfig from './config';
import validator from 'validator';
import _log from './loggingTools';
import inert from 'inert';
import MY_PLAYERS from './CRUD-my_players.js';
import crypto from "crypto";
import _commonsPasswordHelpers from './commons-passwordHelpers.js';
import _commonsServerHelpers from './commons-serverHelpers.js';
import _commonsLinkHelpers from './commons-linkHelpers.js';    

export const routes_signup = [
{
	path: '/signup',
	method: 'POST',
    config : {
		    auth : false,
    },
	handler: async ( request, reply ) => {        
 try {
	const { email, password } = request.payload;
	console.log("signup check request received for email: " + email );	 //todo : request.IPsource pour logguer
	var escapedInputEmail = (validator.escape(email)).toLowerCase();
	console.log("escaped email to be checked: " + escapedInputEmail );
	
    if(!validator.isEmail(escapedInputEmail)) {
		console.log(console,request,"INVALID EMAIL : escaped email : " + escapedInputEmail);
		return reply('Input is not a valid email. ').code(422); // Attempt should be reported in logs with IP source!
	}
	else {
        console.log("email oK")
        if(!_commonsPasswordHelpers.passwordIsValid(password)) {
            console.log("password mismatch");
            return reply("password does not match required complexity").code(422);
        }
        // TODO : if email exist : send reply : cannot register : existing user
        
        var _isExistingEmail = await MY_PLAYERS.doesPlayerExistByEmail(console, escapedInputEmail);
        try {
              console.log("isExistingEmail after call to amazon db", _isExistingEmail);
              if (_isExistingEmail) {
                    return reply({'message' : 'Email already exists. '}).code(422); // Attempt should be reported in logs with IP source!
              };
        }
        catch(ex) {
            return reply( {'error' : true,
                        'message' : 'Error while checking if email exists!' + ex}).code(500);            
        }
            
        console.log("after check player exists");
        // if does not exist in my_players :     
		// TODO V2: ckeck avatar + pseudo . consistent ?
        //TODO V2 : create new player with validated flag to false : email, avatar, and password stored
        var escapedInputAvatar = " ";
        var escapedInputPseudo = " ";

        console.log("before link");
        var signupLink=  Buffer.from(crypto.createHash('sha512').update(crypto.randomBytes(512)).digest('hex').toString()+";"
                                     +escapedInputEmail, 'binary').toString('base64');
        var signupLinkExpiracyTimestamp = (new Date().setTime(new Date().getTime() + 6*60*60*1000)).toString();

        var isTemporaryAccountNeedingSignupValidation =true;
   
        try {
            MY_PLAYERS.create(escapedInputEmail, password, escapedInputAvatar, escapedInputPseudo, signupLink, signupLinkExpiracyTimestamp,
                          isTemporaryAccountNeedingSignupValidation);
        }
        catch (ex) {
            console.error('Player could not be created!!?' + ex);
            return reply({"error" : "true", "message" : 'We temporarily could not create your account. \
                         Please try again in a few minutes.'}).code(500);
        }
        
        // CALL AMAZON for  sending email including unique link UNDER WORK!!
        var fullLink=_commonsServerHelpers.getFullRequestPath(request) + '/' + signupLink;
        MY_PLAYERS.sendEmailForSignupConfirmation(console, '"J\'apprends le chinois en jouant" <noreply@japprendslechinoisenjouant.fr>',
                                                                      escapedInputEmail, fullLink)
        .then(resolve => {return reply({"error" : "false", "message" : 'Welcome! You shall receive in a few seconds a personal validation email with a link to folllow \
                           for definitive confirmation of your account creation!'}).code(200)})
        .catch(ex =>  { console.error( 'Error while attempting to send signup confirmation email for ' + escapedInputEmail + ' '+ ex);
                    return reply({"error" : "true", "message" : "Error while attempting to send signup confirmation email. \
                                 Try logging to verify that signup completed "});
               })            
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
	path: '/signup/{link}', 
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
    
    console.log("signup confirmation request received for link: " + _escapedLink );	 //todo : request.IPsource pour logguer
  	
    var myObjectLink= _commonsLinkHelpers.isLink(_escapedLink);
    if(!myObjectLink) {
		console.error("INVALID confirmation signup link: " + _escapedLink);
		return reply('Input is not a valid confirmation link. Attempt has been reported!');
	}
    
    await MY_PLAYERS.validateSignupLink(_escapedLink, myObjectLink.email)
        .then(resolve => {
              return reply('<!doctype html><html lang="fr">\
                           <head><meta charset="utf-8">\
                            <title>Welcome! Your subscription is confirmed!</title>\
                            <meta http-equiv="refresh" content="3;URL='+ _myConfig.frontURL +'/login">\
                           </head>\
                            <body><h1>Hey there!</h1> \
                                  Congratulations, your subscription is confirmed ! Wait a second, we take you to login ... </body></html>'
                        ).code(200)
            }
        )
   
        
        .catch(ex =>  {
                console.error( 'Error while attempting to confirm signup email for ' + myObjectLink.email
                              + ' link part:' + myObjectLink.link   + ' '+ ex);
                return reply('The validation link you provided is not valid. Ask for a new one to confirm\
                             your account.').code(422);
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
}
,
{
	path: '/signupReemissionRequest', 
	method: 'POST',
    config : {
		    auth : false,
    },
	handler: async ( request, reply ) => {        
 try {
	const { email } = request.payload;
	console.log("signup check request received for email: " + email );	 //todo : request.IPsource pour logguer
	var escapedInputEmail = (validator.escape(email)).toLowerCase();
	console.log("escaped email to be checked: " + escapedInputEmail );
	
 if(!validator.isEmail(escapedInputEmail)) {
		console.log(console,request,"INVALID EMAIL : escaped email : " + escapedInputEmail);
		return reply('Input is not a valid email.').code(422);
	}
	else {
        console.log("email ok")
        var link = Buffer.from(crypto.createHash('sha512').update(crypto.randomBytes(512)).digest('hex').toString()+";"+escapedInputEmail, 'binary')
            .toString('base64');

        console.log("New signup reemission link " + link);
        var linkExpiracyTimestamp = parseInt(new Date().setTime(new Date().getTime() + 2*60*60*1000), 10);
 
        MY_PLAYERS.renewSignupConfirmationLink(escapedInputEmail, link, linkExpiracyTimestamp)
        .then( resolve =>  {console.log('Signup reemission link for player performed successfully');
               // CALL AMAZON for  sending email including unique link 
              MY_PLAYERS.sendEmailForSignupConfirmation(console, '"J\'apprends le chinois en jouant" <noreply@japprendslechinoisenjouant.fr>',
                           escapedInputEmail, _commonsServerHelpers.getHostFromRequest(request) + '/signup/' + link);
              })
        .then(resolve => {return reply({"error" : "false", "message" : 'Welcome! You shall receive in a few seconds a personal validation email with a link to folllow \
                           for definitive confirmation of your account creation!'}).code(200)})
        .catch(ex =>  { console.error( 'Error while attempting to send signup confirmation email for ' + escapedInputEmail + ' '+ ex);
                    return reply({"error" : "true", "message" : "Error while attempting to send signup confirmation email. \
                                 Verify the email you input an try again. "});
               })              
	}}
 catch (ex)  {
	  console.error("", ex.message);
	  return reply({
				error: true,
				errMessage: 'server-side error'
	  });
	}}
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
];
