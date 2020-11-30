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
const logger = require('./utils/logger');

console.log('MDb_URI', config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
  .then(() => logger.info('Mongo DB connection successful'))
  .catch((error) => logger.error(error.response.data));

app.use(cors());
// search for matching path for GET requests from static frontend build file
app.use(express.static('build'));
app.use(express.json());

// use wishRouter object for handling queries to the path specified
app.use('/api/wishes', wishRouter);

module.exports = app;
