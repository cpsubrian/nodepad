
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var mongoose = app.mongoose = require('mongoose');
var mongoStore = app.mongoStore = require('connect-mongodb');

var pub = __dirname + '/public';
var Settings = {
  development: {},
  production: {},
  test: {}
}

//Configuration.
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('db-uri', 'mongodb://127.0.0.1/nodepad-dev');
});
app.configure('production', function(){
  app.use(express.errorHandler());
  app.set('db-uri', 'mongodb://127.0.0.1/nodepad');
});
app.configure('test', function() {
  app.set('db-uri', 'mongodb://127.0.0.1/nodepad-test');
})
app.configure(function(){
  //Connect to the database.
  mongoose.connect(app.set('db-uri'));
  
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register('.html', require('jqtpl').express);
  
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: "ThisIsASecretString",
    store: mongoStore(app.set('db-uri'))
  }));
  app.use(express.compiler({ src: pub, enable: ['less'] }));
  app.use(express.static(pub));
  app.use(express.methodOverride());
  app.use(app.router);
});

// Controllers.
app.UserController = require('./controllers/UserController.js')(app);
app.DocumentController = require('./controllers/DocumentController.js')(app);
 
// Generic Routes.
app.get('/', app.UserController.loadUser, function(req, res){
  res.redirect('/documents')
});

// Enable if using node-inspector.
if (!process.env.cluster) {
  app.listen(3000);
}