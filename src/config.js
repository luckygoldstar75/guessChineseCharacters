import AWS from 'aws-sdk';

var serverHost='localhost'||'0.0.0.0'; //0.0.0.0 is for heroku / localhost in dev mode

AWS.config.update({
      accessKeyId: "AKIAI25TDQD76X2NL3QQ",
      secretAccessKey: "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",
      region: "us-east-1",
      httpOptions: {timeout: 500}
  });

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
                        } 
};

export default _myConfig ;
