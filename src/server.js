import Hapi from 'hapi';
import routes from './routes';
import _myConfig from './config';

const server = new Hapi.Server();

server.connection({ port: _myConfig.server.port, host: _myConfig.server.host });

server.register( [require('inert')], ( err ) => {
    if( !err ) {
        console.log( 'done' );
    }

} );

    routes.forEach( ( route ) => {
        console.log( `attaching ${ route.path }` );
        server.route( route );
    } );

server.start( err => {

    if( err ) {

        // Fancy error handling here
        console.error( 'Error was handled!' );
        console.error( err );

    }
    
        const cache = server.cache({ segment: 'sessions', expiresIn: _myConfig.server.cookieExpirationTimeMs});
		server.app.cache = cache;
        
        server.auth.strategy('session', 'cookie', {
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

    console.log( `Server started at ${ server.info.uri }` );

} );
