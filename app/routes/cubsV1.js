/**
 * app/routes/cubsV1.js
 * - APIv1
 */

var Cub = require('../models/cub');
var Bear = require('../models/bear');

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
			Cub.find(function(err, cubs) {
				if(err)
					res.send(err);

				res.json(cubs);
			});
		})

		// create a cub (accessed at POST /api/v1/cubs)
		.post(ensureAuthenticated, function(req, res) {
			var cub = new Cub();
			cub.name = req.body.name;
			cub.addedBy = req.user.id;
			cub.parents.mother = req.body.motherId;
			cub.parents.father = req.body.fatherId;

			cub.save(function(err) {
				if(err)
					res.send(err);

				// Add cub to mother bear
				Bear.findById(req.body.motherId, function(err, bear) {
					if(err)
						res.send(err);

					bear.cubs.push(cub._id);

					bear.save(function(err) {
						if(err)
							res.send(err)
					});
				});
				// Add cub to father bear
				Bear.findById(req.body.fatherId, function(err, bear) {
					if(err)
						res.send(err);
					
					bear.cubs.push(cub._id);

					bear.save(function(err) {
						if(err)
							res.send(err)
					});
				});

				res.json({ message: 'V1: Cub created!' });
			});
		});

	// routes that end in /cubs/:cub_id
	routerV1.route('/cubs/:cub_id')
		// get cub with id (accessed at GET /api/v1/cubs/:cub_id)
		.get(function(req, res) {
			Cub.findById(req.params.cub_id, function(err, cub) {
				if(err)
					res.send(err);

				res.json(cub);
			});
		})

		// update cub with id (accessed at PUT /api/v1/cubs/:cub_id)
		.put(ensureAuthenticated, function(req, res) {
			Cub.findById(req.params.cub_id, function(err, cub) {
				if(err)
					res.send(err);

				cub.name = req.body.name;
				cub.parents.mother = req.body.motherId;
				cub.parents.father = req.body.fatherId;

				cub.save(function(err) {
					if(err)
						res.send(err);
					if(cub.addedBy != req.user.id)
						res.json({ message: "You are not the owner!" });

					res.json({ message: 'V1: Cub updated!' });
				});
			});
		})

		// delete cub with id (accessed at DELETE /api/v1/cubs/:cub_id)
		.delete(ensureAuthenticated, function(req, res) {
			Cub.remove({
				_id: req.params.cub_id,
				addedBy: req.user.id
			}, function(err, cub) {
				if(err)
					res.send(err);
				if(cub.addedBy != req.user.id)
					res.json({ message: "You are not the owner!" });

				res.json({ message: 'V1: Cub deleted!' });
			});
		});
};