const userRouter = require('express').Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

userRouter.get('/', async (request, response, next) => {
  try {
    response.json(await User.find({}).populate('WishedItem'));
  } catch (exception) {
    next(exception);
  }
});

userRouter.post('/', async (request, response, next) => {
  try {
    const newUser = request.body;
    // replace user input password with password hash
    newUser.password = await bcryptjs.hash(newUser.password, 10);
    // save request data as new user &
    // send new user instance returned by the db
    const savedUser = await new User(newUser).save({ runValidators: true });
    response.json(savedUser).status(201);
  } catch (exception) {
    next(exception);
  }
});

// get one instance
userRouter.get('/:dbid', async (request, response, next) => {
  try {
    const userList = await User.find({ _id: request.params.dbid }).populate('WishedItem');
    // respond with user object
    response.json(userList[0]);
  } catch (exception) {
    next(exception);
  }
});

// delete one
userRouter.delete('/:id', async (request, response, next) => {
  try {
    await User.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = userRouter;
