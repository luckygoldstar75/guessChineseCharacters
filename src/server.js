import Hapi from 'hapi';
import routes from './routes';
import _myConfig from './config';

const server = new Hapi.Server();

server.connection({ port: process.env.PORT || _myConfig.server.port , 
	host: '0.0.0.0' || _myConfig.server.host,
	routes : { cors : true } });

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

