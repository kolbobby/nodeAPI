/**
 * app/models/user.js
 * - APIv1
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcryptjs');

var UserSchema = new Schema({
	email: { type: String, unique: true },
	password: String
});

UserSchema.pre('save', function(next) {
	var user = this;
	if(!user.isModified('password'))
		return next();
	bcrypt.genSalt(10, function(err, salt) {
		if(err)
			return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err)
				return next(err);

			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err)
			cb(err);

		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);