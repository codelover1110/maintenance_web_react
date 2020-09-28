import config from 'config';
import { fetchWrapper } from '../_helpers/fetch-wrapper';

const baseUrl = `${config.apiUrl}/users`;

export const metadataService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getConsumptionData
};

function getAll() {
    return fetchWrapper.get('http://localhost:8000/getMetaDatas');
}

function getById(id) {
    return fetchWrapper.get(`http://localhost:8000/editMetaData/${id}`);
}

function create(params) {
    return fetchWrapper.post('http://localhost:8000/createMetaData/', params);
}

function update(id, params) {
    return fetchWrapper.post(`http://localhost:8000/updateMetaData/${id}`, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`http://localhost:8000/deleteMetaData/${id}`);
}



function getConsumptionData(id) {
    return fetchWrapper.get(`http://localhost:8000/getConsumptionData/${id}`);
}

