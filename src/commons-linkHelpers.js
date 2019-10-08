import validator from 'validator';

const _commonsLinkHelpers = {
isLink: function (_link) {
    var _escapedLink;
    
    _escapedLink = validator.escape(_link);
    var _myIsBase64 = validator.isBase64(_link);
        
    if (_link !== null && _link !== undefined && (_escapedLink=validator.escape(_link)) === _link
        && validator.isBase64(_link)) {
        var _decodedLinkReceived = Buffer.from(_escapedLink, 'base64').toString('binary');
        var decodedLinkSplitArray = _decodedLinkReceived.split(";");
        
        if (decodedLinkSplitArray && decodedLinkSplitArray.length === 2) {
            var _myEmail = decodedLinkSplitArray[1];
            var _myLink = decodedLinkSplitArray[0];
            if(validator.isEmail(_myEmail)) {
                return {'email' : _myEmail, 'link' : _myLink}    
            }
        }
        
    }    
    
    return null;
}
};

export default _commonsLinkHelpers ;