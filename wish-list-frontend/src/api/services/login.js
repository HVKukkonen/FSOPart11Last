/* eslint import/prefer-default-export: 0 */
import axios from 'axios';

let baseUrl = '/api/login';
if (process.env.NODE_ENV === 'development') {
  baseUrl = `http://localhost:3003${baseUrl}`;
}

const requestToken = (userInfo) => axios.post(baseUrl, userInfo);

const BackendLogin = { requestToken };
export { BackendLogin };
