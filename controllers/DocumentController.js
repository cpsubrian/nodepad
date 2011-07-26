/**
 * Module Variables.
 */
var Document, app;

// Export an instance of a DocumentController.
module.exports = function(application) {
  app = application;
  Document = app.Document = require('../models/Document.js')(app.mongoose);
  return new DocumentController()
}

/**
 * DocumentController
 * 
 * Sets up routes and logic for interacting with documents.
 */
var DocumentController = function() {
  var loadUser = app.UserController.loadUser;
  
  app.get('/documents.:format?', loadUser, this.listDocs);
  app.post('/documents.:format?', loadUser, this.createDoc);
  app.get('/documents/new', loadUser, this.newDoc);
  
  app.param(':docId', this.docIdParam);
  app.get('/documents/:docId/edit', loadUser, this.editDoc);
  app.get('/documents/:docId.:format?', loadUser, this.readDoc);
  app.put('/documents/:docId.:format?', loadUser, this.updateDoc);
  app.del('/documents/:docId.:format?', loadUser, this.deleteDoc);
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
            return doc.toJSON();
          }));
        break;

        default:
          res.render('documents', {
            title: 'Documents',
            docs: docs,
            currentUser: req.currentUser
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
          res.send(doc.toJSON());
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
        res.send(req.doc.toJSON());
      break;
  
      default:
        res.render('documents/show', {
          doc: req.doc,
          currentUser: req.currentUser
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
          res.send(doc.toJSON());
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
      doc: req.doc,
      currentUser: req.currentUser
    });
  },
  
  /**
   * New document.
   */
  newDoc : function(req, res) {
    res.render('documents/new', {
      doc: new Document(),
      currentUser: req.currentUser
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
