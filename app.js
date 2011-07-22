
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var mongoose = app.mongoose = require('mongoose');

// Configuration.
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register('.html', require('jqtpl').express);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  mongoose.connect('mongodb://127.0.0.1/nodepad-dev');
});

app.configure('production', function(){
  app.use(express.errorHandler());
  mongoose.connect('mongodb://127.0.0.1/nodepad');
});

app.configure('test', function() {
  mongoose.connect('mongodb://127.0.0.1/nodepad-test');
})

// Controllers.
var DocumentController = require('./controllers/DocumentController.js')(app);
 
// Generic Routes.
app.get('/', function(req, res){
  res.render('index', {
    title: 'NodePad'
  });
});

// Enable if using node-inspector.
if (!process.env.cluster) {
  app.listen(3000);
}