/**
 * Document Model
 */
module.exports = function(mongoose) {
  var mongoose = mongoose;
  var Schema = mongoose.Schema;

  // Document Schema
  mongoose.model('Document', new Schema({
    title: {type: String, index: true},
    data: String,
    tags: [String]
  }));
  
  return mongoose.model('Document');
};