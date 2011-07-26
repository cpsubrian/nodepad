/**
 * Document Model
 */
module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  // Document Schema
  var DocumentSchema = new Schema({
    user_id: {type: ObjectId, index: true},
    title: {type: String, index: true},
    data: String,
    tags: [String]
  });
  DocumentSchema.virtual('id').get(function() {
    return this._id.toHexString();
  });
  
  mongoose.model('Document', DocumentSchema);
  
  return mongoose.model('Document');
};