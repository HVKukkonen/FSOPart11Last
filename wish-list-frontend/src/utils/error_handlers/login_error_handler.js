const logger = require('../logger');

export default function loginErrorHandler(error) {
  logger.error('following error occured', error.message);

  if (error.response.data.keyword === 'admin') {
    window.alert('Admin secret is incorrect');
  }

  if (error.response.data.keyword === 'password') {
    window.alert('Incorrect username or password');
  }
}
