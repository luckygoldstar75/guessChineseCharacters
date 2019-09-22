'use strict';
import _myConfig from './config';
import AWS from 'aws-sdk';
import _log from './loggingTools';

const SCORES =
{
  __tableName : "scores",
  retrieveUserScoresForGameAndLevelPreviousSessions : function ( __email, callback ) {
                      var ddb = new AWS.DynamoDB();
                      
                      console.debug("email: " + __email + " game: " + __game + " level: " : __level);

                      if( __email==undefined) {
                         callback("SCORE NOT FOUND : email undefined", null);
                         return;
                      }

                      var params = {
                          TableName: this.__tableName,
                          "ExpressionAttributeValues": {":email" : {"S" : __email} , "game" : {"S" : __game}, "level" : {"S" : __level}},
						  "KeyConditionExpression": "email = :email and game = :game",
                          "FilterExpression" : "level = :level"
						  "Limit": 1,
						  ScanIndexForward: false
                          };
                    
                    var _reply= undefined;    
                    ddb.query(params, async function(err, data) {
                    if (err) { 
						console.error(err + ' Unable to read last session item ' + err.stack);
						callback(err, null);
					} 
					else if (data === undefined || data.Items === undefined || 
						data.Items.length<1 || data.Items[0].nbPoints === undefined
						) {
						console.log('last session item empty or partly empty');
						callback(null, {})
					}
					else {
                        var nbPoints=data.Items[0].nbPoints.N;
                        var rank=data.Items[0].rank.N;

                        console.debug("data " + JSON.stringify(data));
                        _reply = {'nbPoints': nbPoints, 'rank' : rank};
                        console.log("_reply " + JSON.stringify(_reply));
                        callback(null, _reply)                        
                      }
                    });
  },
};
export default LEADERBOARDS;
