const logger = require('../logger');

export default function userErrorHandler(error) {
  logger.error('following error occured', error.message);
  // logger.error('FRONT response.data is', error.response.data);

  if (error.response.data.keyword === 'username') {
    window.alert('Username not unique');
  }

  if (error.response.data.keyword === 'invite') {
    window.alert('Invalid invite');
  }
}
