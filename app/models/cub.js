/**
 * app/models/cubV1.js
 * - APIv1
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Bear = require('./bear');

var CubSchema = new Schema({
	name: String,
	addedBy: String,
	parents: {
		mother: String,
		father: String
	}
});

CubSchema.methods.getMother = function(cb) {
	Bear.findById(this.parents.mother, function(err, bear) {
		if(err)
			res.send(err);

		cb(bear);
	});
};

CubSchema.methods.getFather = function(cb) {
	Bear.findById(this.parents.father, function(err, bear) {
		if(err)
			res.send(err);

		cb(bear);
	});
};

module.exports = mongoose.model('Cub', CubSchema);