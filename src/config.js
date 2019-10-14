import AWS from 'aws-sdk';
require('dotenv').config();


const awsConfig={
    accessKeyId: process.env.awsSecretAccessKeyId,
      secretAccessKey: process.env.awsSecretAccessKey,
      region: process.env.awsRegion,
      httpOptions: {timeout: 500}    
};

var serverHost= process.env.serverHost;

export const my_origin=  process.env.myOrigin;

AWS.config.update(process.env.awsConfig || awsConfig);

const _myConfig = {
 "server" :  {  
	host: serverHost,
	port: 4000,
	privateKeyAuth : process.env.privateKeyAuth,
	cookieExpirationTimeMs : 3 * 24 * 60 * 60 * 1000, /* Set session to 3 days */
	tableOfCurrentGuess : [],
	tableOfCurrentConnections : []
	},
	
"guid" : function() {
                          function _p8(s) {
                              var p = (Math.random().toString(16)+"000000000").substr(2,8);
                              return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
                          }
                          return _p8() + _p8(true) + _p8(true) + _p8();
                        },
"frontURL" : process.env.frontURL
}

export default _myConfig ;
