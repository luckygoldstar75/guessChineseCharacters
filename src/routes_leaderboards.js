"use strict";

import _myConfig from './config';
import validator from 'validator';
import _log from './loggingTools';
import inert from 'inert';


export const routes_leaderboards = [
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
}}
];
