import Hapi from 'hapi';
import routes from './routes';
import _myConfig from './config';

const server = new Hapi.Server();

server.connection({ port: _myConfig.server.port, host: _myConfig.server.host });

var _myAuth = require('./authenticationPlugin');
console.log("auth plugin ", _myAuth );


server.register( require( './authenticationPlugin' ), ( err ) => {

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

    console.log( `Server started at ${ server.info.uri }` );

} );