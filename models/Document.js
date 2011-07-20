/**
 * Document Model
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Document Schema
mongoose.model('Document', new Schema({
  title: {type: String, index: true},
  data: String,
  tags: [String]
}));

// Export model.
module.exports = function(db) {
  return db.model('Document');
};