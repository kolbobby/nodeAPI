/**
 * app/controllers/CubController.js
 * - APIv1
 */

var Cub = require('../models/cub');
var Bear = require('../models/bear');

exports.GetCubs = function(req, res) {
	Cub.find(function(err, cubs) {
		if(err)
			res.send(err);

		res.json(cubs);
	});
};
exports.CreateCub = function(req, res) {
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
};

exports.GetCub = function(req, res) {
	Cub.findById(req.params.cub_id, function(err, cub) {
		if(err)
			res.send(err);

		res.json(cub);
	});
};
exports.UpdateCub = function(req, res) {
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
};
exports.DeleteCub = function(req, res) {
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
};

module.exports = exports;