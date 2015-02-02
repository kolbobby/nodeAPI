/**
 * app/models/cubV1.js
 * - APIv1
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CubSchema = new Schema({
	name: String,
	addedBy: String,
	parents: {
		mother: String,
		father: String
	}
});

module.exports = mongoose.model('Cub', CubSchema);