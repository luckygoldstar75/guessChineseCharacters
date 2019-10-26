"use strict";

import _myConfig from './config';
import validator from 'validator';
import _log from './loggingTools';
import inert from 'inert';
import GAMES from './games.js';
import SESSIONS from './CRUD-sessions.js';
import PLAYER_RESULTS from './CRUD-playerResults.js';
import _commonsGameHelpers from './commons-gameHelpers.js';

const NB_SUGGESTIONS = 5;

export const routes_games_common = [
{
	path: '/services/guess/{gameName}/{level?}',
	method: 'GET',
	config : {
      auth: false,
	  cors: {
		origin: _myConfig.my_origin,
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
				 
				 if (request.params  && request.params.level && typeof request.params.level ==="string" )  {
					console.log("raw level from URL: ", request.params.level);
					_level=encodeURIComponent(request.params.level);
					console.log("level computed from url: ", _level);
				 }
				 if (request.params  && request.params.gameName && typeof request.params.gameName ==="string" )  {
					console.log("raw gameName from URL: ", request.params.gameName);
					_gameName=encodeURIComponent(request.params.gameName);
					console.log("gameName computed from url: ", _gameName);
				 }
				 
				 var question = GAMES.getNextQuestion(_gameName, Object.keys(_commonsGameHelpers.levels).indexOf(_level), NB_SUGGESTIONS);

				 var myUniqueGuessId=_myConfig.guid();
				 console.log("myUniqueGuessId: ", myUniqueGuessId);
				 // TODO : see if needed to obfuscate characters so as to not get them stolen : myCar.pinyin="forYouToGuess";
				 var returnGuessItem = { "id": myUniqueGuessId ,
					"type" : question.question.type, "value" : question.question.value,
					suggestedAnswers : question.question.suggestedAnswers,
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
	path: '/services/guess/{id}', 
	method: 'POST',
	config: {
		auth: {
			strategy: 'standard'                    
		},  
	},  //TODO : how to do it for simple visitors / no account?
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
					validator.escape(guessItem.expectedAnswer.value).toLowerCase() === validator.escape(answer.value).toLowerCase()
				) {
				   isGood = true;
				 }
				else {
				  console.log("Wrong answer, user made a mistake : question was : " + guessItem.expectedAnswer + " VS user answer:" + answer );
				}

				var response = {"id": _id,
								   "isGood" : isGood,
								   "answer" : guessItem.expectedAnswer};

				// try to add result
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
								  PLAYER_RESULTS.add(__email, __sid, guessItem.game, guessItem.level, guessItem.type, guessItem.value,
													 answer.type, answer.value,isGood,Date.now(), afterAddPlayerResult);								  
								  }
						  });
				  } 
				  
				  function afterAddPlayerResult(err) {
						if(err === null) { //pas d'erreur
							// Nothing to do?
						}
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
{
path: '/services/scores/{gameName}',
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
path: '/services/playerResults/{gameName}/{level?}',
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
		let  __sid, __game, __level;
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
			 request.server.app.cacheSession.get(__sid, (err, value, cached, log) => {
				  if(err || value == null || value.email == null) {
					  console.error("could not get session sid in cache: " + err );
					  failClean();
					}
				  else {										  
					  var __email = value.email;
					  if (__email != null) {
						  console.debug("just before PLAYERRESULTS.retrieve with email: " +__email);		
						  try {
							if (__level ===undefined || __level === null) {
								let receiveLastLevelForGameAndChainFortheResults=((err, levelObject) => {
									console.debug("just before PLAYERRESULTS.retrieveUserResultsForGameAndLevel with email: " +__email);		
									var _retrievedLevel = (levelObject === undefined || levelObject === null
										|| levelObject.level === undefined || levelObject.level === null
										|| Object.keys(_commonsGameHelpers.levels).indexOf(levelObject.level) === -1)
										?Object.keys(_commonsGameHelpers.levels)[0]:levelObject.level;
									try {
											PLAYER_RESULTS.retrieveUserResultsForGameAndLevel(__email, __game, _retrievedLevel, getPlayerResults);
									}
									catch (ex)  {
										console.error("getting player results error : ", ex.message);
										return reply({
										level: ERROR,
										message: 'server-side error'
									}).code(500);
									}
								});
								
								PLAYER_RESULTS.retrieveLastLevelForGameAndUser(__email, __game,
																			   receiveLastLevelForGameAndChainFortheResults); //updates __level								
							
								
							}
							else {
								PLAYER_RESULTS.retrieveUserResultsForGameAndLevel(__email, __game, __level, getPlayerResults);
							}
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
		
		
		
		var getPlayerResults=((err, playerResultsObject) => {
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
		});	
}}
];
