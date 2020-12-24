const logger = require('./logger');

const errorHandler = (error, request, response, next) => {
  logger.error('following error occured', error.message);
  logger.error('WITH error object', error);
  logger.error('AND error.name', error.name);
  logger.error('AND2 error.errors', error.errors);

  // username error
  if (error.errors.username) {
    response.status(422)
      .send({
        description: 'Username already exists',
        keyword: 'username',
      });
  }

  // incorrect invite link
  if (error.name === 'CastError') {
    response.status(400)
      .send({
        description: 'Failed to cast invite string into user db id',
        keyword: 'invite',
      });
  }

  if (error.name === 'ValidationError') {
    response.status(400)
      .send({
        description: 'Failed to cast invite string into user db id',
        keyword: 'invite',
      });
  }

  next(error);
};

module.exports = errorHandler;
