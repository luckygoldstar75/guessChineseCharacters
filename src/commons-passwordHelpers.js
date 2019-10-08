const _commonsPasswordHelpers = {
  minimumPasswordSize :  8,
  passwordIsValid : function(pwd) {
    if(pwd !== null && pwd !== undefined &&  pwd.length >= this.minimumPasswordSize
       &&  pwd.match(/^(?=.*[a-z])^(?=.*[A-Z])^(?=.*\d)^(?=.*[^A-Za-z0-9])/)) {        
        return true;
    }
    return false;
}
};

export default _commonsPasswordHelpers ;