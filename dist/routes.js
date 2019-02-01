'use strict';

const events = require('./handlers/events');

const users = require('./handlers/users');

const admin = require('./handlers/admin');

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.use('/users', users);
  app.use('/events', events);
  app.use('/admin', admin); // app.get('/configured', configured(opts));
};