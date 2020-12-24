const logger = require('./logger');

const userErrorHandler = (error) => {
  logger.error('FRONT following error occured', error.message);
  logger.error('FRONT response.data is', error.response.data);

  if (error.response.data.keyword === 'username') {
    window.alert('Username not unique');
  }

  if (error.response.data.keyword === 'invite') {
    window.alert('Invalid invite');
  }
};

module.exports = userErrorHandler;
