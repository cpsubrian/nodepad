/**
 * User Model
 */
module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;
  var crypto = require('crypto');
  
  function validatePresenceOf(value) {
    return value && value.length;
  }

  // User Schema
  var UserSchema = new Schema({
    email: {type: String, validate: [validatePresenceOf, 'an email is required'], index: {unique: true}},
    hashed_password: String,
    salt: String,
  });
  
  // Add virtual id field.
  UserSchema.virtual('id').get(function() {
    return this._id.toHexString();
  });
  
  // Add virtual password field.
  UserSchema.virtual('password')
    .get(function() {
      return this._password;
    })
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
    });
  
  // Add methods to the model.
  UserSchema.method({
    
    authenticate: function(plainText) {
      return this.encryptPassword(plainText) === this.hashed_password;
    },

    makeSalt: function() {
      return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    encryptPassword: function(password) {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    },

    isValid: function() {
      // TODO: Better validation
      return this.email && this.email.length > 0 && this.email.length < 255
             && this.password && this.password.length > 0 && this.password.length < 255;
    }
  });
  
  // Validate before saving.
  UserSchema.pre('save', function(next) {
    if (!validatePresenceOf(this.password)) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
  });
  
  mongoose.model('User', UserSchema);
  
  return mongoose.model('User');
};

