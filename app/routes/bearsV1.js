/**
 * app/routes/bearsV1.js
 * - APIv1
 */

var Bear = require('../models/bear');

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
			Bear.find(function(err, bears) {
				if(err)
					res.send(err);

				res.json(bears);
			});
		})

		// create a bear (accessed at POST /api/v1/bears)
		.post(ensureAuthenticated, function(req, res) {
			var bear = new Bear();
			bear.name = req.body.name;
			bear.addedBy = req.user.id;

			bear.save(function(err) {
				if(err)
					res.send(err);

				res.json({ message: 'V1: Bear created!' });
			});
		});

	// routes that end in /bears/:bear_id
	routerV1.route('/bears/:bear_id')
		// get bear with id (accessed at GET /api/v1/bears/:bear_id)
		.get(function(req, res) {
			Bear.findById(req.params.bear_id, function(err, bear) {
				if(err)
					res.send(err);

				res.json(bear);
			});
		})

		// update bear with id (accessed at PUT /api/v1/bears/:bear_id)
		.put(ensureAuthenticated, function(req, res) {
			Bear.findById(req.params.bear_id, function(err, bear) {
				if(err)
					res.send(err);
				if(bear.addedBy != req.user.id)
					res.json({ message: "You are not the owner!" });

				bear.name = req.body.name;

				bear.save(function(err) {
					if(err)
						res.send(err);

					res.json({ message: 'V1: Bear updated!' });
				});
			});
		})

		// delete bear with id (accessed at DELETE /api/v1/bears/:bear_id)
		.delete(ensureAuthenticated, function(req, res) {
			Bear.remove({
				_id: req.params.bear_id,
				addedBy: req.user.id
			}, function(err, bear) {
				if(err)
					res.send(err);
				if(bear.addedBy != req.user.id)
					res.json({ message: "You are not the owner!" });

				res.json({ message: 'V1: Bear deleted!' });
			});
		});
};