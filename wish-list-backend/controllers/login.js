// TITLE: Create session token from user login
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const loginRouter = require('express').Router();
require('dotenv').config();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  // request for admin creation
  if (request.body.adminSecret) {
    if (request.body.adminSecret === process.env.ADMIN_SECRET) {
      response.status(200).send(true);
    } else {
      response.status(401).send({
        description: 'admin secret incorrect',
        keyword: 'admin',
      });
    }
  } else {
    const user = await User.findOne({ username: request.body.username });

    const passwordCorrect = (user === null)
      ? false
      : await bcryptjs.compare(request.body.password, user.password);

    if (!(user && passwordCorrect)) {
      response.status(401).send({
        description: 'invalid username or password',
        keyword: 'password',
      });
    } else {
      const userForToken = {
        username: user.username,
        id: user._id,
      };

      const token = jwt.sign(userForToken, process.env.SECRET);

      response
        .status(200)
        .send({ token, user });
    }
  }
});

module.exports = loginRouter;
