"use strict";

import _myConfig from './config';
import validator from 'validator';
import _log from './loggingTools';
import inert from 'inert';

export const routes_admin = [
{
path: '/services/hello',
method: 'GET',
config : {
      auth: false,
},
handler: ( request, reply ) => {
	reply('hello world'); //.type('text/plain');
}
},
{
path: '/services/stats', // NOT FUNCTIONAL : SERVER SIDE ERRORS : REDEFINE PURPOSE!!!!
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
{ // TO BE REMOVE IN PRODUCTION MODE
path: '/services/dumRetrieveLastSession',
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
	path: '/services/privacyCheckTestService', //TODO NOT BE PUT IN PRODUCTION
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
				return reply('valid sessionId').code(200);
		} catch (ex)  {
	console.error("", ex.message);
			return reply( 'server-side error' ).code(500);
		}
}

},
{
path: '/services/listSessions',
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
}
];
