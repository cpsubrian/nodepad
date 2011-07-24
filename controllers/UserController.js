/**
 * Module Variables.
 */
var User, app;

// Export an instance of a DocumentController.
module.exports = function(application) {
  app = application;
  User = app.User = require('../models/User.js')(app.mongoose);
  return new UserController()
}

/**
 * UserController
 * 
 * Sets up routes and logic for interacting with users.
 */
var UserController = function() {  
  app.get('/users/new', this.newUser);
  app.post('/users.:format?', this.createUser);
  
  app.get('/sessions/new', this.newSession);
  app.post('/sessions', this.createSession);
  app.del('/sessions', this.loadUser, this.deleteSession);
}

/**
 * UserController Prototype.
 */
UserController.prototype = {
  /**
   * Load the current user from the session.
   */
  loadUser : function(req, res, next) {
    if (req.session.user_id) {
      User.findById(req.session.user_id, function(err, user) {
        if (user) {
          req.currentUser = user;
          next();
        } else {
          res.redirect('/sessions/new');
        }
      });
    } else {
      res.redirect('/sessions/new');
    }
  },
  
  /**
   * New User Form.
   */
  newUser : function(req, res) {
    res.render('users/new', {
      locals: { user: new User() }
    });
  },

  /**
   * Create a user (POST).
   */
  createUser : function(req, res) {
    var user = new User(req.body.user);

    function userSaved() {
      switch (req.params.format) {
        case 'json':
          res.send(user.__doc);
        break;

        default:
          req.session.user_id = user.id;
          res.redirect('/documents');
      }
    }

    function userSaveFailed() {
      // TODO: Show error messages
      res.render('users/new', {
        locals: { user: user }
      });
    }

    user.save(userSaved, userSaveFailed);
  },

  /**
   * New Session Form.
   */
  newSession : function(req, res) {
    res.render('sessions/new', {
      locals: { user: new User() }
    });
  },

  /**
   * Create a session (POST).
   */
  createSession : function(req, res) {
    User.findOne({ email: req.body.user.email }, function(err, user) {
      if (user && user.authenticate(req.body.user.password)) {
        req.session.user_id = user.id;
        res.redirect('/documents');
      } else {
        // TODO: Show error
        res.redirect('/sessions/new');
      }
    });
  },

  /**
   * Delete a session.
   */
  deleteSession : function(req, res) {
    if (req.session) {
      req.session.destroy(function() {});
    }
    res.redirect('/sessions/new');
  }   
}
