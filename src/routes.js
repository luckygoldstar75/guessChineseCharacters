"use strict";

import jwt from 'jsonwebtoken';
import _myConfig from './config';
import validator from 'validator';
import _log from './loggingTools';
import inert from 'inert';
import GAMES from './games.js';
import SESSIONS from './CRUD-sessions.js';
import LEADERBOARDS from './CRUD-leaderboards.js';
import PLAYER_RESULTS from './CRUD-playerResults.js';
var SHA256 = require("crypto-js/sha256");

export const my_origin= ['http://melocal:4000', 'http://melocal:3000', 'http://localhost:3000', 'http://localhost:4000', 'https://japlcej.herokuapp.com']; // an array of origins or 'ignore'	

export const routes = [
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
	path: '/guess/{gameName}/{level?}',
	method: 'GET',
	config : {
      auth: false,
	  cors: {
		origin: my_origin,
		//credentials : true,
		additionalHeaders: ['cache-control', 'x-requested-with', 'accept-language', "Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type"]
      }
    },            
	handler: ( request, reply ) => { try {	
			   console.log("new call to: " + request.method + " " + request.path  +
						   "/{gameName} with gameName " + request.params.gameName +
						   "/{level?} with level " + request.params.level +
						" with params " + ((request.params === null)? undefined: JSON.stringify(request.params)) +
						" and payload " + ((request.payload === null)? undefined: JSON.stringify(request.payload)));
			
				 var _level=null;
				 var _gameName=null;

				 console.log("Request Params: ", request.params);
				 console.log("Request Params: level", request.params.level);
				 
				 if (request.params  && request.params.level && typeof request.params.level ==="number" )  {
					console.log("raw level from URL: ", request.params.level);
					_level=encodeURIComponent(request.params.level);
					console.log("level computed from url: ", _level);
				 }
				 if (request.params  && request.params.gameName && typeof request.params.gameName ==="string" )  {
					console.log("raw gameName from URL: ", request.params.gameName);
					_gameName=encodeURIComponent(request.params.gameName);
					console.log("gameName computed from url: ", _gameName);
				 }
				 
				 var question = GAMES.getNextQuestion(_gameName, _level);

				 var myUniqueGuessId=_myConfig.guid();
				 console.log("myUniqueGuessId: ", myUniqueGuessId);
				 // TODO : see if needed to obfuscate characters so as to not get them stolen : myCar.pinyin="forYouToGuess";
				 var returnGuessItem = { "id": myUniqueGuessId ,
					"type" : question.question.type, "value" : question.question.value,
						"game" : question.game, "level" : question.level,
										  "timestamp" : Date.now()};
				 console.log("returnGuessItem" + returnGuessItem);
				 var stringGuessItem = JSON.stringify(returnGuessItem);
				 var guessItem = returnGuessItem;
				 guessItem.expectedAnswer = question.expectedAnswer;
				_myConfig.server.tableOfCurrentGuess[myUniqueGuessId]=guessItem;
				return reply(stringGuessItem).code(200);
		} catch (ex)  {
	console.error("Exception catchée: ", ex.message, ex.stack);
			reply( 'server-side error' ).code(500);
		}
}

},
{
	path: '/guess/{id}', 
	method: 'POST',
	config: {
		auth: {
			strategy: 'standard'                    
		},  
	},  //TODO : how to fo it for simple visitors / no account?
	handler: async ( request, reply ) => { try {
			   console.log("new call POST to: " + request.method + " " + request.path  +
						" with params " + ((request.params === null)? undefined: JSON.stringify(request.params)) +
						" and payload " + ((request.payload === null)? undefined: JSON.stringify(request.payload)));
				 var answer =request.payload;
				 var _id = null;	
				 
				  if (request.params  && request.params.id && typeof request.params.id ==="string" )  {
					//console.log("raw id from URL: ", request.params.id);
					_id=encodeURIComponent(request.params.id);
					//console.log("id computed from url: ", _id);
				 }
				 
				 if(_myConfig.server.tableOfCurrentGuess[_id] === null || _myConfig.server.tableOfCurrentGuess[_id] === undefined) {
					 console.log("_myConfig.server.tableOfCurrentGuess[id]: " + JSON.stringify(_myConfig.server.tableOfCurrentGuess));
					 return reply({
							error: true,
							errMessage: "guess : id " + _id + " not found"
					});
				}
				 
				 var isGood = false;
				 var guessItem = _myConfig.server.tableOfCurrentGuess[_id];  //object set in GET guessCharacter
				 console.log(JSON.stringify( _myConfig.server.tableOfCurrentGuess));
				 console.log("guessItem:" +  JSON.stringify(guessItem));

				delete _myConfig.server.tableOfCurrentGuess[_id]; // the guess is now to be erased : it has been tested for guess once
		
				if (guessItem.expectedAnswer.type === answer.type &&
					guessItem.expectedAnswer.value.toLowerCase() === validator.escape(answer.value).toLowerCase()
				) {
				   isGood = true;
				 }
				else {
				  console.log("Wrong answer, user made a mistake : question was : " + guessItem.expectedAnswer + " VS user answer:" + answer );
				}

				var response = {"id": _id,
								   "isGood" : isGood,
								   "answer" : guessItem.expectedAnswer};

				// try to update session with score
				try {				  
				  var __sid=null;
				  console.log("request.state['authsid'] "+ request.state['authsid']);
				  if(request.state['authsid'] !== null && request.state['authsid'] !== undefined) {
					__sid=request.state['authsid'].sid;
					var __email=null;    
					 request.server.app.cacheSession.get(__sid, (err, value, cached, log) => {
							  if(err) {
								  console.error("could not get session sid in cache: " + err )
								}
							  else {										  
								  __email=value.email;
								  console.log("Success: get session sid in cache: " + __email);
								  SESSIONS.updateScore(__sid, __email, isGood, console, getResult);
								  PLAYER_RESULTS.add(__email, guessItem.game, guessItem.level, guessItem.type, guessItem.value,
													 answer,isGood,Date.now());
								  }
						  });
				  }
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
				  //console.debug("after print session");
				  
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
						console.debug("key:" + key + " value:" + response[key]) ;
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
{
path: '/scores/{gameName}',
method: 'GET',
config: {
	auth: {
			strategy: 'standard'                    
		}, 
	/*cors: {
		origin: ['http://localhost:3000'],
		credentials : true,
		additionalHeaders: ['cache-control', 'x-requested-with', 'accept-language', "Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type"]
      }     */       
},
handler: ( request, reply ) => {			
		var  __sid, __email;
		var response ={};
		console.log('In GET /scores/' + request.params.gameName);
		
		if (request && request.state['authsid']) {
			__sid = request.state['authsid'].sid;
			console.log("email retrieved : request : " + request + " request.state['authsid']" + JSON.stringify(request.state['authsid']) + " email: " + __email);
		}
		
		function failClean() {
				return reply({
				level: ERROR,
				message: 'technical error : scores could not be retrieved'
			}).code(500);					
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
						  console.log("just before SCORES.retrieve");		
						  try {
							return reply({percentageDone : 30,
      percentageGood:70, level: "1:novice"}).code(200);
							//SCORES.retrieve(__email, request.params.gameName, processScoresResult);
						  }
						  catch (ex)  {
							console.error("getting scores error for user : ", __email , " and game ", request.gameName, " ", ex.message);
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
			 
			 function processScoresResult(err, _scores) {
					console.debug("_scores: " + _scores);
					if (_scores !== undefined && _scores !== null && _scores.error === undefined 
							&& _scores.percentageDone !== undefined && _scores.percentageGood !== undefined) {
							response.percentageDone = _scores.percentageDone;
							response.percentageGood = _scores.percentageGood;							
					}
					
					if (err !== undefined && err !== null) {
						console.warn("error : " + err + err.stack);
						console.warn("Could not retrieve scores: aws call returned object undefined");
						console.warn("response:" + response);
						response.error="technical error : scores could not be retrieved";
						console.warn("response:" + response);
					}
					
				  };	
		}
		catch (ex)  {						  
				  console.error("Exception triggered when attempting to retrieve game scores for user : ", __email , " and game ", request.gameName, " ", ex.message);
				  failClean();
		}
		
}}
,
{
path: '/rank',
method: 'GET',
config: {
	auth: {
			strategy: 'standard'                    
		}, 
	/*cors: {
		origin: ['http://localhost:3000'],
		credentials : true,
		additionalHeaders: ['cache-control', 'x-requested-with', 'accept-language', "Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type"]
      }     */       
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
}},
{
path: '/playerResults/{gameName}/{level?}',
method: 'GET',
config: {
	auth: {
			strategy: 'standard'                    
		}, 
	/*cors: {
		origin: ['http://localhost:3000'],
		credentials : true,
		additionalHeaders: ['cache-control', 'x-requested-with', 'accept-language', "Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type"]
      }     */       
},
handler: ( request, reply ) => {			
		var  __sid, __game, __level;
		var response ={};
			__game = request.params.gameName;
			__level=request.params.level;
		console.log('In GET /playerResults/'+ __game + "/" + __level);	
		
		if (request && request.state['authsid']) {
			__sid = request.state['authsid'].sid;
			console.log("email retrieved : request : " + request +
						" request.state['authsid']" + JSON.stringify(request.state['authsid']));
		}
		
		function failClean() {
				return reply({
				level: ERROR,
				message: 'technical error : rank could not be retrieved'
			}).code(500);					
		}
		
		try {
			 var __sid=request.state['authsid'].sid;
			 request.server.app.cacheSession.get(__sid, (err, value, cached, log) => {
				  if(err || value == null || value.email == null) {
					  console.error("could not get session sid in cache: " + err );
					  failClean();
					}
				  else {										  
					  var __email = value.email;
					  if (__email != null) {
						  console.log("just before PLAYERRESULTS.retrieve with email: " +__email);		
						  try {
							PLAYER_RESULTS.retrieveUserResultsForGameAndLevel(__email, __game, __level, getPlayerResults);
						  }
						  catch (ex)  {
							console.error("getting player results error : ", ex.message);
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
		
		function getPlayerResults(err, playerResultsObject) {
			if (playerResultsObject == null) {
				return reply().code(204); // no content
			}
			else if (err) {
			  console.log(err);
			  failClean();	
			}
			else {			 		
			 return reply(playerResultsObject).code(200);
			}
		}	
}}
];
