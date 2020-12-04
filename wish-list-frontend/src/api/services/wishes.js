/* eslint import/prefer-default-export: 0 */
import axios from 'axios';

// const baseUrl = 'http://localhost:3003/api/wishes/';
const baseUrl = '/api/wishes';

const getAll = () => axios.get(baseUrl)
  .then((response) => response.data);

const create = (newObject) => axios.post(baseUrl, newObject);

const update = (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject);

const remove = (id) => axios.delete(`${baseUrl}/${id}`);

// package backend methods and export
const BackendWish = {
  getAll, create, update, remove,
};
export { BackendWish };
