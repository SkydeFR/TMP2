'use strict';
const simple = require('./handlers/simple');
const users = require('./handlers/users');

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.use('/users', users);
  // app.get('/configured', configured(opts));
};
