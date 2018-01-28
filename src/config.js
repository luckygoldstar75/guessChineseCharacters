const _myConfig = {
 "server" :  {  
	host: 'localhost',
	port: 3000,
	privateKeyAuth : 'eb6195b4d1ebb0c1d336a38629f11871401ec0c19c950caa91275db57cccbdbf513d8fd1c5e60311a724406910238dbffeabe17cf36fbbddb2b158472b07b1fc',
	authAlgo : 'HS512',
	authExpiracyInHours : '1h',
	tableOfCurrentConnections : [],
	tableOfCurrentGuess : []
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
