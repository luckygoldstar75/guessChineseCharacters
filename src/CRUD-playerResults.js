'use strict';
import _myConfig from './config';
import AWS from 'aws-sdk';
import _log from './loggingTools';

const _levels= {"novice" : 200,
"confirmé" : 400,
"avancé" : 400,
"maître" : 400};

const PLAYER_RESULTS =
{
    levels : _levels,
  __tableName : "results_byPlayerAndTimestamp",
  retrieveUserResultsForGameAndLevel : function ( __email, __gameName, __level, callback ) {
                      var ddb = new AWS.DynamoDB();
                      
                      console.debug("retrieveUserResultsForGameAndLevel : email: " + __email + " game: " + __gameName + " level: " + __level);

                      if( __email==undefined) {
                         callback("PLAYER_RESULTS NOT FOUND : email undefined", null);
                         return;
                      }

                      var params = {
                          TableName: this.__tableName,
                          "ExpressionAttributeNames": {"#level" : "level"},
                          "ExpressionAttributeValues": {":email" : {"S" : __email} , ":gameName" : {"S" : __gameName},
                          ":level" : {"S" : __level}},
						  "KeyConditionExpression": "email = :email ",
                          "FilterExpression" : "#level = :level AND gameName = :gameName ",
						  "Limit": this.levels[__level],
						  ScanIndexForward: false
                          };
                    
                    var _reply= undefined;    
                    ddb.query(params, async function(err, data) {
                    if (err) { 
						console.error(err + ' Unable to read last session item ' + err.stack);
						callback(err, null);
					} 
					else if (data === undefined || data.Items === undefined || 
						data.Items.length<1 ) {
						console.log('no existing results items found');
						callback(null, {})
					}
					else {
                        
 /* Item example:                       {
  "email": "japprends.le.chinois.en.jouant@gmail.com",
  "timestamp": "20190905144612675",
  "gameName" : ,
  "level" : "novice",
  "toBeGuessed": \"安\",
  "answer" : \"firo\",
  goodAnswer : \"true\"}"
}*/
/* Items example : data {"Items":[{"gameName":{"S":"readCharacterWritePinyin"},"isGood":{"BOOL":true},
 * "question":{"S":"安"},"level":{"S":"novice"},"timestamp":{"S":"1567870314056"},
 * "email":{"S":"japprends.le.chinois.en.jouant@gmail.com"},"answer":{"S":"ān"}},
 * {"gameName":{"S":"readCharacterWritePinyin"},"isGood":{"BOOL":false},
 * "question":{"S":"安"},"level":{"S":"novice"},"timestamp":{"S":"1567870304056"},
 * "email":{"S":"japprends.le.chinois.en.jouant@gmail.com"},"answer":{"S":"firo"}},
 * {"gameName":{"S":"readCharacterWritePinyin"},"question":{"S":"安"},"isGood":{"BOOL":false},
 * "level":{"S":"novice"},"timestamp":{"S":"1567870294056"},
 * "email":{"S":"japprends.le.chinois.en.jouant@gmail.com"},"answer":{"S":"firo"}}],"Count":3,"ScannedCount":3}
*/

 
                    // Let's assume here we have items fetched
                        //var nbPoints=data.Items[0].nbPoints.N;
                        //var rank=data.Items[0].rank.N;
                    var nbTries = data.Count;
                    var numGood = data.Items.reduce(function (n, item) {
                                    return n + (item.isGood.BOOL === true);
                    }, 0);
                    var percentageGood = Math.round(numGood / nbTries * 100);
                    var percentageTries = Math.round(nbTries / PLAYER_RESULTS.levels[__level] *100);
                    
                     console.debug("data " + JSON.stringify(data));
                     _reply = {'percentageGood': percentageGood,
                               'percentageTries' : percentageTries,
                               'level' : data.Items[0].level.S
                     };
                     console.log("_reply " + JSON.stringify(_reply));
                     callback(null, _reply);                        
                      }
                    });
  },
  add : function(__email, guessItem, __answer, isGood, timestamp ) {
    /*/*__email, guessItem.game, guessItem.level, guessItem.type, guessItem.value,
													 answer,isGood,Date.now());*/
                                                     
      return null; //dummy implementation                                               
  }
};
export default PLAYER_RESULTS;
