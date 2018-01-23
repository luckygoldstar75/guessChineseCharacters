'use strict';
module.exports = {

getClientIP : function(console, request) {
	console.log(request.headers['x-forwarded-for']);
	console.log(   request.connection.remoteAddress);
    //console.log(request.socket.remoteAddress);
    console.log(request.connection.socket.remoteAddress);
				
	return request.headers['x-forwarded-for'] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress;	
},

logging : function (console,request,message) {
				var myClientIP = "" ; // this.getClientIP(console, request); TODO: find a way to log IP
        console.warn("Request:" + request.url.path + " FROM:" + myClientIP + " Message:" + message);
  }
		
};
