var DocumentController = module.exports = function(app) {
  var app = app;
  
  // Models.
  var Document = require('../models/Document.js')(app.mongoose);
  
  // Document list
  app.get('/documents.:format?', function(req, res) {
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
  });
  
  // Create document 
  app.post('/documents.:format?', function(req, res) {
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
  });
  
  // Read document
  app.get('/documents/:id.:format?', function(req, res) {
  });
  
  // Update document
  app.put('/documents/:id.:format?', function(req, res) {
  });
  
  // Delete document
  app.del('/documents/:id.:format?', function(req, res) {
  });
}