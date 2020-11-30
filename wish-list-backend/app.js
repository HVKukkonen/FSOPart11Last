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

console.log('MDb_URI', config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI,
  {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
  });

app.use(cors());
app.use(express.json());
// search for matching path for GET requests from static frontend build file
app.use(express.static('build'));

// use wishRouter object for handling queries to the path specified
app.use('/api/wishes', wishRouter);
// app.use('/api/users', usersRouter)
// app.use('/api/login', loginRouter)

module.exports = app;
