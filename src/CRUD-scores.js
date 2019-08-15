  'use strict';
  import _myConfig from './config';
  import AWS from 'aws-sdk';
  import _log from './loggingTools';
  
  const SCORES =
  {
    __tableName : "scores_byPlayerAndGame",
    retrieveScores : function ( __email, __gameName, callback ) {
                        var ddb = new AWS.DynamoDB();
                        
    console.debug("email: " + __email);

    if( __email==undefined) {
       callback("Scores NOT FOUND for email undefined : ", null);
       return;
    }

    var params = {
        TableName: this.__tableName,
        "ExpressionAttributeValues": {":email" : {"S" : __email} , ":gameName" : {"S" : __gameName}},
      "KeyConditionExpression": "email = :email and gameName = :gameName",
      "Limit": 1,
      ScanIndexForward: false
    };
                      
    var _reply= undefined;    
    ddb.query(params, async function(err, data) {
    if (err) { 
      console.error(err + ' Unable to read scores item ' + err.stack);
      callback(err, null);
    } 
    else if (data === undefined || data.Items === undefined || 
    data.Items.length<1 || data.Items[0].nbPoints === undefined
    ) {
    console.log('scores item empty or partly empty');
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
  }};

export default SCORES;
