'use strict';
import _myConfig from './config'; 

exports.register = function (server, options, next) {
        var hapiAuthJwtPlugin=require('hapi-auth-jwt');
        console.log("hapiAuthJwtPlugin  " , hapiAuthJwtPlugin);
        server.register(hapiAuthJwtPlugin);
        server.auth.strategy('token', 'jwt', {
                key: _myConfig.server.privateKeyAuth,
                verifyOptions: {
                algorithms: [ _myConfig.server.authAlgo ],
        }});
  };

exports.register.attributes = {
  name: 'authenticationPlugin',
  version: '1.0.0'
};