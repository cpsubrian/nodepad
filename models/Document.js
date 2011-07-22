/**
 * Document Model
 */
module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  // Document Schema
  mongoose.model('Document', new Schema({
    user_id: {type: ObjectId, index: true},
    title: {type: String, index: true},
    data: String,
    tags: [String]
  }));
  
  return mongoose.model('Document');
};