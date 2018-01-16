    import jwt from 'jsonwebtoken';
    import _myConfig from './config';
    
    const routes = [
    {
        path: '/hello',
        method: 'GET',
        handler: ( request, reply ) => {
            reply('hello world'); //.type('text/plain');
        }
    },
    
    {
            path: '/auth',
            method: 'POST',
            handler: ( request, reply ) => { try {
                const { username, password } = request.payload;
            console.log("password NEEDS to be checked");	 //todo : request.IPsource
    
                if( username in _myConfig.users && _myConfig.users[username] === password) {
                        
               const token = jwt.sign( {
                            username,
                            scope: username
                        }, _myConfig.server.privateKeyAuth, {
                            algorithm: _myConfig.server.authAlgo,
                            expiresIn: _myConfig.server.authExpiracyInHours
                        } );
                
                console.log("good password");
                var expiryTimeForNewToken = Date.now() + _myConfig.server.authExpiracyInHours*3600*1000;
                _myConfig.server.tableOfCurrentConnections.push({token : {user: username , expiryTime : expiryTimeForNewToken}});
                        reply( {    
                            token,
                            scope: username
                        } );
                    } else {
                console.log("incorrect password");
                        reply( 'incorrect password' );
                    }
                } catch (ex)  {
            console.error("", ex.message);
                    reply( 'server-side error' );		
                }
        }
    },
        
    {   
            path: '/nouveauTest',
            method: 'GET',
            config: {
                auth: {
                    strategy: 'token',
                }
            },
            handler: ( request, reply ) => { try {
                    if (request.auth.credentials.token in _myConfig.server.tableOfCurrentConnections) {
                        console.log("new Test for user with valid token: value : " + request.auth.credentials.token + " and username " +_myConfig.server.tableOfCurrentConnections[token].user);
                        
                    }
                    else  {
                        if (request.auth.credentials.token === undefined) {
                        console.log("new Test for user without token: value : " + request.auth.credentials.token);
                        }
                        else  {
                        console.log("new Test for user with INVALID token: value : " + request.auth.credentials.token);
                        }
                    }
                    
                    reply('gameCouldStart');
                } catch (ex)  {
            console.error("", ex.message);
                    reply( 'server-side error' );		
                }
        }
        
        
    }];
    
    export default routes;
    
