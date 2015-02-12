/**
 * conf/passport.js
 */

/**
 * Module Dependencies
 */
var LocalStrategy = require('passport-local').Strategy,
	User = require('../app/models/user');

module.exports = function(passport) {
	/**
	 * Passport Session Setup
	 * - Required for persistent login sessions
	 * - Passport needs ability to serialize and unserialize users out of session
	 */

	/**
	 * Serialize user
	 */
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	/**
	 * Deserialize user
	 */
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	/**
	 * Local Signup
	 */
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done) {
		/**
		 * Asynchronous
		 * - User.findOne won't process unless data is sent back
		 */
		process.nextTick(function() {
			/**
			 * Find a user whose email is the same as forms email
			 * - Checking if user trying to signup already exists
			 */
			User.findOne({ 'email': email }, function(err, user) {
				if(err)
					return done(err);

				if(user) {
					return done(null, false);
				} else {
					if(password != req.body.confirm_password) {
						return done(null, false);
					} else {
						/**
						 * Create User
						 */
						var newUser = new User();
						newUser.email = email;
						newUser.password = password;

						newUser.save(function(err) {
							if(err)
								return done(err);

							return done(null, newUser);
						});
					}
				}
			});
		});
	}));

	/**
	 * Local Login
	 * - Named strategies
	 */
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done) {
		/**
		 * Find a user whose email is the same as forms email
		 * - Checking if user trying to login already exists
		 */
		User.findOne({ 'email': email }, function(err, user) {
			if(err)
				return done(err);

			if(!user)
				return done(null, false);

			user.comparePassword(password, function(err, isMatch) {
				if(err)
					return done(err);

				if(isMatch)
					return done(null, user);

				return done(null, false);
			});
		});
	}));
};