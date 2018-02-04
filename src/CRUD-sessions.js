'use strict';
import _myConfig from './config';
import AWS from 'aws-sdk';
import _log from './loggingTools';

const SESSIONS =
{
  __tableName : "my_sessions",
  update : async function (__auth, __email, isGood, console ) {

                      var dynamoSessions = new AWS.DynamoDB();
                      var targetCounter = ((isGood === true) ? "nbGood" : "nbFalse");
                      //var __auth=request.headers.authorization;
                      var __token = undefined;
                      //var __email=request.auth.credentials.scope;

                      console.log("TOKEN: " + __token);
                      console.log("email: " + __email);

                      if (__auth !=null) {
                        __token = __auth.split(" ")[1];
                      }
                      console.log("TOKEN: " + __token);



                      if(__token === undefined || __email===undefined) {
                         return reply({
                            error: true,
                            errMessage: "LOGIN/PASSWORD NOT FOUND"
                          });
                      }

                      var params = {
                          TableName: SESSIONS.__tableName,
                          Key: {"email" : {S: __email},
                          //"timestamp" : {N: "1517527485777"}
                          },
                          ExpressionAttributeNames : {
                            "#counter": targetCounter,
                            "#token" : "token"
                          },
                          ExpressionAttributeValues : {
                            ":ONE": {N : "1" },
                            ":token": {S : __token },
                          },
                          UpdateExpression: "add #counter :ONE",
                          ConditionExpression: "#token= :token",
                          ReturnValues : "ALL_NEW"
                        };

                    await dynamoSessions.updateItem(params, function(err, data) { //WARN : TODO : GET ONLY the MAX timestamp session for user
                      if (err) {
                        console.log(err + ': Unable to update item' + err.stack);
                        return undefined;
                      } else {
                        var nbGood=data.Attributes.nbGood.N;
                        var nbFalse=data.Attributes.nbFalse.N;

                        console.log("data " + JSON.stringify(data));
                        //console.log("nbGood, nbFalse " + " " + nbGood + " " + nbFalse);
                        var _reply = {'nbGood': nbGood, 'nbFalse' : nbFalse};
                        console.log("_reply " + JSON.stringify(_reply));
                        return _reply;
                      }
                    });
  }
};
export default SESSIONS;
