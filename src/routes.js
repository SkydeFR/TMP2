'use strict';
const events = require('./handlers/events');
const users = require('./handlers/users');
const admin = require('./handlers/admin');
const types = require('./handlers/types');

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.use('/users', users);
  app.use('/events', events);
  app.use('/admin', admin);
  app.use('/types', types);
  // app.get('/configured', configured(opts));
};
