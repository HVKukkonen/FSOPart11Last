/* eslint import/prefer-default-export: 0 */
import axios from 'axios';

let baseUrl = '/api/wishes';
if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://localhost:3003/api/wishes';
}

// send wisher (maybe different than user) as request to backend
const getForWisher = (wisher) => axios.get(`${baseUrl}/${wisher}`);

const create = (newObject) => axios.post(baseUrl, newObject);

const update = (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject);

const remove = (id) => axios.delete(`${baseUrl}/${id}`);

// package backend methods and export
const BackendWish = {
  getForWisher, create, update, remove,
};
export { BackendWish };
