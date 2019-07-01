"use strict";

import jwt from 'jsonwebtoken';
import _myConfig from './config';
import validator from 'validator';
import _log from './loggingTools';
import inert from 'inert';
import CHINESE_CHARACTERS_JSON from './chineseCaracters.js';
import SESSIONS from './CRUD-sessions.js';
import LEADERBOARDS from './CRUD-leaderboards.js'
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
	path: '/guessCharacter/{level?}',
	method: 'GET',
	config : {
      auth: false,
	  cors: {
		origin: ['http://localhost:3000'],
		//credentials : true,
		additionalHeaders: ['cache-control', 'x-requested-with', 'accept-language', "Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type"]
      }
    },            
	handler: ( request, reply ) => { try {	
			   console.log("new call to: " + request.method + " " + request.path  + "/{level} with level " + request.params.level +
						" with params " + ((request.params === null)? undefined: JSON.stringify(request.params)) +
						" and payload " + ((request.payload === null)? undefined: JSON.stringify(request.payload)));
			
				 var _level=null;
				 
				 console.log("Request Params: ", request.params);
				 console.log("Request Params: level", request.params.level);
				 
				 if (request.params  && request.params.level && typeof request.params.level ==="number" )  {
					console.log("raw level from URL: ", level);
					_level=encodeURIComponent(request.params.level);
					console.log("level computed from url: ", _level);
				 }
				 var myCar = CHINESE_CHARACTERS_JSON.getNextRandomCharacter(_level);
				 var myUniqueGuessId=_myConfig.guid();
				 console.log("myUniqueGuessId: ", myUniqueGuessId);
				 // TODO : see if needed to obfuscate characters so as to not get them stolen : myCar.pinyin="forYouToGuess";
				 var guessItem = { "id": myUniqueGuessId ,"character" : myCar,
										  "timestamp" : Date.now()};
				 var stringGuessItem = JSON.stringify(guessItem);
				_myConfig.server.tableOfCurrentGuess[myUniqueGuessId]=guessItem;
				return reply(stringGuessItem).code(200);
		} catch (ex)  {
	console.error("Exception catchée: ", ex.message, ex.stack);
			reply( 'server-side error' ).code(500);
		}
}

},
{
	path: '/guessCharacter', 
	method: 'POST',
	config: {
		auth: false 
	},  //TODO : how to fo it for simple visitors / no account?
	handler: async ( request, reply ) => { try {
			   console.log("new call POST to: " + request.method + " " + request.path  +
						" with params " + ((request.params === null)? undefined: JSON.stringify(request.params)) +
						" and payload " + ((request.payload === null)? undefined: JSON.stringify(request.payload)));
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
				 console.log(JSON.stringify( _myConfig.server.tableOfCurrentGuess));
				 console.log("charTobeGuessed:" +  JSON.stringify(charTobeGuessed));

				delete _myConfig.server.tableOfCurrentGuess[id]; // the guess is now to be erased : it has been tested for guess once
		
				if (charTobeGuessed.character.pinyin.toLowerCase() === validator.escape(userInputPinyin).toLowerCase() ) {
				   isGood = true;
				 }
				else {
				  console.log("Wrong inputCharacter, user made a mistake " +
								  charTobeGuessed.caracter + " is in pinyin: " + charTobeGuessed.pinyin + " VS user input pinyin:" + userInputPinyin );
				}

				var response = {"id": id,
								   "isGood" : isGood,
								   "answer" : charTobeGuessed.character.pinyin};

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
			console.error("", ex.message,ex.stack);
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
},
,
{
path: '/rank',
method: 'GET',
config: {
	auth: {
			strategy: 'standard'                    
		}, 
	cors: {
		origin: ['http://localhost:3000'],
		credentials : true,
		additionalHeaders: ['cache-control', 'x-requested-with', 'accept-language', "Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type"]
      }            
},
handler: ( request, reply ) => {			
		var  __sid, __email;
		var response ={};
		console.log('In GET /rank');
		
		if (request && request.state['authsid']) {
			__sid = request.state['authsid'].sid;
			console.log("email retrieved : request : " + request + " request.state['authsid']" + JSON.stringify(request.state['authsid']) + " email: " + __email);
		}
		
		function failClean() {
				return reply({
				level: ERROR,
				message: 'technical error : rank could not be retrieved'
			}).code(500);					
		}
		
		function updateEmail(newEmailValue) {
			__email = newEmailValue;
		}
		
		try {
			 var __sid=request.state['authsid'].sid;
			 request.server.app.cacheSession.get(__sid, (err, value, cached, log) => {
				  if(err || value == null || value.email == null) {
					  console.error("could not get session sid in cache: " + err );
					  failClean();
					}
				  else {										  
					  __email = value.email;
					  if (__email != null) {
						  console.log("just before LEADERBOARDS.retrieve");		
						  try {
							LEADERBOARDS.retrieveRank(__email, getRank);
						  }
						  catch (ex)  {
							console.error("getting rank error : ", ex.message);
							return reply({
								level: ERROR,
								message: 'server-side error'
							}).code(500);
						  }
					}
					else {
					  return reply().code(204); // no content
					}							  
				 }
			 });
		}
		catch (ex)  {						  
				  console.error("Exception triggered when attempting to retrieve email from cookie sid", ex.message);
				  failClean();
		}
		
		function getRank(err, rankingObject) {
			if (rankingObject == null) {
				return reply().code(204); // no content
			}
			else if (err) {
			  console.log(err);
			  failClean();	
			}
			else {
			 var myRankingObject ={};
				myRankingObject.rank = rankingObject.rank;
				myRankingObject.nbPoints = rankingObject.nbPoints;
								
			 return reply(myRankingObject).code(200);
			}
		}	
}}
];

export default routes;
