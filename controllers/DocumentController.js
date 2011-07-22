/**
 * Module Variables.
 */
var Document = null;
var app = null;

// Export an instance of a DocumentController.
module.exports = function(application) {
  app = application;
  Document = require('../models/Document.js')(app.mongoose);
  return new DocumentController(app)
}

/**
 * DocumentController
 * 
 * Sets up routes and logic for interacting with documents.
 * 
 * @param app
 *  The express application object.
 */
var DocumentController = function() {
  // Setup Routes.
  app.get('/documents.:format?', this.listDocs);
  app.post('/documents.:format?', this.createDoc);
  app.get('/documents/:id.:format?', this.readDoc);
  app.put('/documents/:id.:format?', this.updateDoc);
  app.del('/documents/:id.:format?', this.deleteDoc);
}

/**
 * DocumentController Prototype.
 */
DocumentController.prototype = {     
  /**
   * Document list.
   */
  listDocs : function(req, res) {
    Document.find(function(documents) {
      switch (req.params.format) {
        case 'json':
          res.send(documents.map(function(d) {
            return d.__doc;
          }));
        break;

        default:
          res.render('documents', {
            title: 'Documents'
          });
      }
    });
  },

  /**
   * Create document.
   */
  createDoc : function(req, res) {
    var document = new Document(req.body['document']);
    document.save(function() {
      switch (req.params.format) {
        case 'json':
          res.send(document.__doc);
         break;

         default:
          res.redirect('/documents');
      }
    });
  },

  /**
   * Read document.
   */
  readDoc : function(req, res) {

  },

  /**
   * Update document.
   */
  updateDoc : function(req, res) {

  },

  /**
   * Delete document.
   */
  deleteDoc : function(req, res) {

  }
}
