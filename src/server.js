import Hapi from 'hapi';
import routes from './routes';
import _myConfig from './config';

const server = new Hapi.Server();

server.connection({ port: process.env.PORT || _myConfig.server.port , 
	host: _myConfig.server.host,
	routes : {cors: {	
		origin: ['http://melocal:4000', 'http://melocal:3000', 'http://localhost:3000', 'https://japlcej.herokuapp.com'], // an array of origins or 'ignore'	
            headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match','Accept-language'], // an array of strings - 'Access-Control-Allow-Headers' 	
            exposedHeaders: ['Accept','WWW-Authenticate', 'Server-Authorization'], // an array of exposed headers - 'Access-Control-Expose-Headers',	
	    //methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],	
            additionalExposedHeaders: ['Accept'], // an array of additional exposed headers	
            maxAge: 60,	
            credentials: true // boolean - 'Access-Control-Allow-Credentials'	
        }}
});

module.exports = server;


server.register([require('inert'), require('./server/auth/index.js')],
  function(err) {	  
	  if( err ) {
			// Fancy error handling here
			console.error( 'Error was handled!' );
			console.error( err );
			throw err;
		}
	  
    //Start the server
    console.log("attempt to start the server");

	routes.forEach( ( route ) => {
        console.log( `attaching ${ route.path }` );
        server.route( route );
	});

    server.start( (err) => {
		//Log to the console the host and port info
        console.log('Server started at: ' + server.info.uri);
    });
});

