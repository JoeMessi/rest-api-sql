'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const Sequelize = require('sequelize');
const routes = require('./routes');


// a Sequelize instance to connect to the database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './fsjstd-restapi.db'
});

// establishing connection to the database
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    //return sequelize.sync();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));
// middleware method that parses incoming JSON from the client and makes it available
// to our Express server via req.body
// also it tells Express to expect that incoming requests will be in the form of a JSON object
app.use(express.json());
// we want to have our API to have all endpoints starting with /api
// this middleware says when a path starts with '/api' use the routes inside routes
app.use('/api', routes);


// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
