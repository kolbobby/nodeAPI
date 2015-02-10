/**
 * app/controllers/BearController.js
 * - APIv1
 */

var Bear = require('../models/bear');

exports.GetBears = function(req, res, cb) {
	Bear.find(function(err, bears) {
		if(err)
			res.send(err);

		cb(bears);
	});
};
exports.CreateBear = function(req, res) {
	var bear = new Bear();
	bear.name = req.body.name;
	bear.addedBy = req.user.id;

	bear.save(function(err) {
		if(err)
			res.send(err);

		res.json({ message: 'V1: Bear created!' });
	});
};

exports.GetBear = function(req, res, cb) {
	Bear.findById(req.params.bear_id, function(err, bear) {
		if(err)
			res.send(err);

		cb(bear);
	});
};
exports.UpdateBear = function(req, res) {
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
};
exports.DeleteBear = function(req, res) {
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
};

module.exports = exports;