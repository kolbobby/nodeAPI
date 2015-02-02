/**
 * app/models/bear.js
 * - APIv1
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var BearSchema = new Schema({
	name: String,
	addedBy: String,
	cubs: Array
});

module.exports = mongoose.model('Bear', BearSchema);