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
  app.get('/documents.:format?', this.listDocs);
  app.post('/documents.:format?', this.createDoc);
  app.get('/documents/new', this.newDoc);
  
  app.param(':docId', this.docIdParam);
  app.get('/documents/:docId/edit', this.editDoc);
  app.get('/documents/:docId.:format?', this.readDoc);
  app.put('/documents/:docId.:format?', this.updateDoc);
  app.del('/documents/:docId.:format?', this.deleteDoc);
}

/**
 * DocumentController Prototype.
 */
DocumentController.prototype = {
  /**
   * Document list.
   */
  listDocs : function(req, res) {
    Document.find({}, function(err, docs) {
      switch (req.params.format) {
        case 'json':
          res.send(docs.map(function(doc) {
            return doc.__doc;
          }));
        break;

        default:
          res.render('documents', {
            title: 'Documents',
            docs: docs
          });
      }
    });
  },

  /**
   * Create document.
   */
  createDoc : function(req, res) {
    var doc = new Document(req.body['document']);
    doc.save(function() {
      switch (req.params.format) {
        case 'json':
          res.send(doc.__doc);
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
    switch (req.params.format) {
      case 'json':
        res.send(req.doc.__doc);
      break;
  
      default:
        res.render('documents/show', {
          doc: req.doc
        });
    }
  },

  /**
   * Update document.
   */
  updateDoc : function(req, res) {
    var doc = req.doc;
    doc.title = req.body.document.title;
    doc.data = req.body.document.data;
    doc.save(function() {
      switch (req.params.format) {
        case 'json':
          res.send(doc.__doc);
         break;

         default:
          res.redirect('/documents');
      }
    });
  },

  /**
   * Delete document.
   */
  deleteDoc : function(req, res) {
    res.doc.remove(function() {
      switch (req.params.format) {
        case 'json':
          res.send('true');
         break;

         default:
          res.redirect('/documents');
      }
    });
  },
  
  /**
   * Edit document.
   */
  editDoc : function(req, res) {
    res.render('documents/edit', {
      doc: req.doc
    });
  },
  
  /**
   * New document.
   */
  newDoc : function(req, res) {
    res.render('documents/new', {
      doc: new Document()
    });
  },
  
  /**
   * DocId Param Pre-Conditions.
   */
  docIdParam : function(req, res, next, id){
    Document.findById(id, function(err, doc) {
      if (err) return next(err);
      if (!doc) return next(new Error('failed to find document'));
      req.doc = doc;
      next();
    });
  }
}
