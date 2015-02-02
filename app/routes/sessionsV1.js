/**
 * app/routes/sessionsV1.js
 * - APIv1
 */

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated())
		next();
	else
		res.send(401);
}
function ensureUnauthenticated(req, res, next) {
	if(!req.isAuthenticated())
		next();
	else
		res.send(401);
}

module.exports = function(routerV1, passport) {
	routerV1.post('/signup', ensureUnauthenticated, passport.authenticate('local-signup'), function(req, res) {
		res.send(200);
	});

	routerV1.post('/login', ensureUnauthenticated, passport.authenticate('local-login'), function(req, res) {
		res.cookie('user', JSON.stringify({ id: req.user._id, email: req.user.email }));
		res.send({ id: req.user._id, email: req.user.email });
	});

	routerV1.get('/logout', ensureAuthenticated, function(req, res) {
		req.logout();
		res.send(200);
	});
};