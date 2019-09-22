"use strict";

import jwt from 'jsonwebtoken';
import _myConfig from './config';
import validator from 'validator';
import _log from './loggingTools';
import inert from 'inert';
import {routes_admin} from './routes_admin';
import {routes_signup} from './routes_signup';
import {routes_games_common} from './routes_games_common';
import {routes_leaderboards} from './routes_leaderboards';


export const routes = Array.prototype.concat([
{
path: '/',
method: 'GET',
handler: ( request, reply ) => {
	if (request.auth.isAuthenticated) {
			reply.file('./devineLesCaracteres.html'); //.type('text/plain');
	}
	else {	
		return h.redirect('/login');	
	}	
}
}
], routes_admin, routes_signup, routes_games_common, routes_leaderboards);
