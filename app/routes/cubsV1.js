/**
 * app/routes/cubsV1.js
 * - APIv1
 */

var CubController = require('../controllers/CubController');

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated())
		next();
	else
		res.send(401);
}

module.exports = function(routerV1) {
	// routes that end in /cubs
	routerV1.route('/cubs')
		// get all cubs (accessed at GET /api/v1/cubs)
		.get(function(req, res) {
			CubController.GetCubs(req, res, function(cubs) {
				res.json(cubs);
			});
		})

		// create a cub (accessed at POST /api/v1/cubs)
		.post(ensureAuthenticated, function(req, res) {
			CubController.CreateCub(req, res, function(message) {
				res.json(message);
			});
		});

	// routes that end in /cubs/:cub_id
	routerV1.route('/cubs/:cub_id')
		// get cub with id (accessed at GET /api/v1/cubs/:cub_id)
		.get(function(req, res) {
			CubController.GetCub(req, res, function(cub) {
				res.json(cub);
			});
		})

		// update cub with id (accessed at PUT /api/v1/cubs/:cub_id)
		.put(ensureAuthenticated, function(req, res) {
			CubController.UpdateCub(req, res, function(message) {
				res.json(message);
			});
		})

		// delete cub with id (accessed at DELETE /api/v1/cubs/:cub_id)
		.delete(ensureAuthenticated, function(req, res) {
			CubController.DeleteCub(req, res, function(message) {
				res.json(message);
			});
		});
};