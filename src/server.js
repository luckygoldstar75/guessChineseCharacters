import Hapi from 'hapi';
import Handlebars from 'handlebars';

import {routes} from './routes';
import _myConfig from './config';

const server = new Hapi.Server();

server.connection({ port: process.env.PORT || _myConfig.server.port , 
	host: _myConfig.server.host,
	routes : {cors: {	
		origin: _myConfig.my_origin, // an array of origins or 'ignore'	
            headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match','Accept-language'], // an array of strings - 'Access-Control-Allow-Headers' 	
            exposedHeaders: ['Accept','WWW-Authenticate', 'Server-Authorization'], // an array of exposed headers - 'Access-Control-Expose-Headers',	
						//methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],	
            additionalExposedHeaders: ['Accept'], // an array of additional exposed headers	
            maxAge: 60,	
            credentials: true // boolean - 'Access-Control-Allow-Credentials'	
        }}
});

module.exports = server;


server.register([require('inert'), require('./server/auth/index.js')], //, require('@hapi/vision') FAILS!!!!????
  function(err) {	  
	  if( err ) {
			// Fancy error handling here
			console.error( 'Error was handled!' );
			console.error( err );
			throw err;
		}
	  
    //Start the server
    console.log("attempt to start the server");
		console.log(routes);
		
	routes.forEach( ( route ) => {
        console.log( `attaching ${ route.path }` );
        server.route( route );
	});

		liftOff;
	
    server.start( (err) => {
		//Log to the console the host and port info
        console.log('Server started at: ' + server.info.uri);
    });
});

async function liftOff() {  
 /* await server.register({
    plugin: require('vision')  // add template rendering support in hapi
  })*/

  // configure template support   
  server.views({
    engines: {
      html: Handlebars
    },
    path: __dirname + '/views',
    layout: 'layout'
  })
}

 