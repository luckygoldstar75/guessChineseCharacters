
const _commonsServerHelpers = {
    getFullRequestPath : function (request) {
    const url = (request.headers['x-forwarded-proto'] || request.connection.info.protocol) 
    + '://' 
    + request.info.host 
    + request.url.path;
    
    return url;
},

getHostFromRequest : function (request) {
    const url = (request.headers['x-forwarded-proto'] || request.connection.info.protocol) 
    + '://' 
    + request.info.host;
    
    return url;
}
};

export default _commonsServerHelpers ;