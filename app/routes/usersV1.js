/**
 * app/routes/usersV1.js
 * - APIv1
 */

var User = require('../models/user');

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated())
		next();
	else
		res.send(401);
}

module.exports = function(routerV1) {
	// routes that end in /users
	routerV1.route('/users')
		// get all users (accessed at GET /api/v1/users)
		.get(function(req, res) {
			User.find(function(err, users) {
				if(err)
					res.send(err);

				for(var i = 0;i < users.length;i++) {
					users[i] = { id: users[i]._id, email: users[i].email };
				}

				res.json(users);
			});
		});

	// routes that end in /users/:user_id
	routerV1.route('/users/:user_id')
		// get user with id (accessed at GET /api/v1/users/:user_id)
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if(err)
					res.send(err);

				res.json({ id: user._id, email: user.email });
			});
		});
};