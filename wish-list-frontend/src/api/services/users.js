/* eslint import/prefer-default-export: 0 */
import axios from 'axios';

const userErrorHandler = require('../../utils/error_handlers');

let baseUrl = '/api/users';
if (process.env.NODE_ENV === 'development') {
  baseUrl = `http://localhost:3003${baseUrl}`;
}

const getAll = () => axios.get(baseUrl)
  .then((response) => response.data);

const create = (newObject) => axios
  .post(baseUrl, newObject)
  .catch((exception) => {
    // custom error handling
    userErrorHandler(exception);
  });

const update = (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject);

const remove = (id) => axios.delete(`${baseUrl}/${id}`);

const getOne = (id) => axios.get(`${baseUrl}/${id}`)
  .then((response) => response.data)
  .catch((exception) => userErrorHandler(exception));

// package backend methods and export
const BackendUser = {
  getAll, create, update, remove, getOne,
};
export { BackendUser };
