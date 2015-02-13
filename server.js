/**
 * server.js
 */

/**
 * Module Dependencies
 */
var express = require('express'),
	app = express(),
	morgan = require('morgan'),
    passport = require('passport'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	session = require('express-session');

var configDB = require('./conf/database');
require('./conf/passport')(passport);

/**
 * Configure
 */
app.set('port', process.env.PORT || 8080);
app.use(bodyParser());
app.use(session({
	secret: 'bobobobobobob',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev')); // Log all requests to console
app.use(function(req, res, next) {
	if(req.user) {
		res.cookie('user', JSON.stringify(req.user));
	}
	next();
});

mongoose.connect(configDB.url);

/**
 * Routes for API
 * - APIv1
 */
var routerV1 = express.Router();

// middleware to use for all requests on Version 1
routerV1.use(function(req, res, next) {
	console.log('Something is happening on Version 1 of our API.');
	next();
});

/**
 * Require routes
 * - APIv1
 */
require('./app/routes/sessionsV1')(routerV1, passport);
require('./app/routes/usersV1')(routerV1);
require('./app/routes/bearsV1')(routerV1);
require('./app/routes/cubsV1')(routerV1);

/**
 * Register routes
 * - APIv1
 */
app.use('/api/v1', routerV1);

/**
 * Start server
 */
app.listen(app.get('port'));
console.log('Magic happens on port ' + app.get('port'));