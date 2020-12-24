// TITLE: main app logic

const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
// connection configuration settings
const config = require('./utils/config');
// const http = require('http')
// intialise Express application
const app = express();
// intialise the router specified
const wishRouter = require('./controllers/wishes');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logger = require('./utils/logger');

const errorHandler = require('./utils/error_handlers');

mongoose
  .connect(config.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
  .then(() => logger.info('Mongo DB connection successful'))
  .catch((error) => logger.error('Error at Mongo connection in app.js', error));

app.use(cors());
// search for matching path for GET requests from static frontend build file
app.use(express.static('build'));
app.use(express.json());

// use wishRouter object for handling queries to the path specified
app.use('/api/wishes', wishRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler);

module.exports = app;
