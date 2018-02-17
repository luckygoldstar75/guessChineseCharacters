'use strict';
import _myConfig from './config'; 

exports.register = function (server, options, next) {
        var hapiAuthCookiePlugin=require('hapi-auth-cookie'); // TODO : ay that if needed : { redirectTo: false }
        console.log("hapiAuthCookiePlugin " , hapiAuthCookiePlugin);
        server.register(hapiAuthCookiePlugin);
        
        const cache = server.cache({ segment: 'sessions', expiresIn: _myConfig.server.cookieExpirationTimeMs});
		server.app.cache = cache;
        
        server.auth.strategy({
			password: _myConfig.server.privateKeyAuth,
			cookie: 'sid',
			redirectTo: '/login',
			isSecure: false,
			validateFunc: async (request, session) => {

				const cached = await cache.get(session.sid);
				const out = {
					valid: !!cached
				};

				if (out.valid) {
					out.credentials = cached.account;
				}

				return out;
			}
		});
		
		server.auth.default('session');
  };

exports.register.attributes = {
  name: 'authenticationPlugin',
  version: '1.0.0'
};
