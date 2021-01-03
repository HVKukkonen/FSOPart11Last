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

// update
userRouter.put('/:id', (request, response, next) => {
  // note how undefined are omitted below
  const user = {
    username: request.body.username,
    role: request.body.role,
    style: request.body.style,
    linkedUsers: request.body.linkedUsers,
    invitePass: request.body.invitePass,
    wish: request.body.wish,
  };

  User
    // findByIdAndUpdate uses $set as default,
    // thus, unspecified fields will stay intact as long as they are dropped using omitUndefined
    .findByIdAndUpdate(request.params.id, user, { new: true, omitUndefined: true })
    // event handler for the returned promise,
    // result of the operation is in the callback paramater updatedUser
    // which is included in the response for frontend use
    .then((updatedUser) => response.json(updatedUser))
    .catch((error) => next(error));
});

module.exports = userRouter;
