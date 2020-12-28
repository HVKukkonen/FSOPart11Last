/* eslint import/prefer-default-export: 0 */
import axios from 'axios';
import loginErrorHandler from '../../utils/error_handlers/login_error_handler';

let baseUrl = '/api/login';
if (process.env.NODE_ENV === 'development') {
  baseUrl = `http://localhost:3003${baseUrl}`;
}

const requestToken = (userInfo) => axios
  .post(baseUrl, userInfo)
  .catch((exception) => loginErrorHandler(exception));

const BackendLogin = { requestToken };
export { BackendLogin };
