/**
 * app/routes/bearsV1.js
 * - APIv1
 */

var BearController = require('../controllers/BearController');

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated())
		next();
	else
		res.send(401);
}

module.exports = function(routerV1) {
	// routes that end in /bears
	routerV1.route('/bears')
		// get all bears (accessed at GET /api/v1/bears)
		.get(function(req, res) {
			BearController.GetBears(req, res);
		})

		// create a bear (accessed at POST /api/v1/bears)
		.post(ensureAuthenticated, function(req, res) {
			BearController.CreateBear(req, res);
		});

	// routes that end in /bears/:bear_id
	routerV1.route('/bears/:bear_id')
		// get bear with id (accessed at GET /api/v1/bears/:bear_id)
		.get(function(req, res) {
			BearController.GetBear(req, res);
		})

		// update bear with id (accessed at PUT /api/v1/bears/:bear_id)
		.put(ensureAuthenticated, function(req, res) {
			BearController.UpdateBear(req, res);
		})

		// delete bear with id (accessed at DELETE /api/v1/bears/:bear_id)
		.delete(ensureAuthenticated, function(req, res) {
			BearController.DeleteBear(req, res);
		});
};