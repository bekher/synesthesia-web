'use strict';

module.exports = {

  http: {
    hostname: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 8302
  },

  db: 'mongodb://localhost/synes-dev',
  mongoose: {
    debug: true
  }

}
