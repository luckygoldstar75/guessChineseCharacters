import AWS from 'aws-sdk';
import {awsConfig} from './awsConfig-private.js';

var serverHost='melocal'||'0.0.0.0'; //0.0.0.0 is for heroku / localhost in dev mode

export const my_origin= ['http://melocal:4000', 'http://melocal:3000', 'http://localhost:3000', 'http://localhost:4000', 'https://japlcej.herokuapp.com']; // an array of origins or 'ignore'	


AWS.config.update(awsConfig);

const _myConfig = {
 "server" :  {  
	host: serverHost,
	port: 4000,
	privateKeyAuth : 'eb6195b4d1ebb0c1d336a38629f11871401ec0c19c950caa91275db57cccbdbf513d8fd1c5e60311a724406910238dbffeabe17cf36fbbddb2b158472b07b1fc',
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
"frontURL" : 'http://melocal:3000' //should not be hard coded : the whole file should be env dependant / deploy time
};

export default _myConfig ;
