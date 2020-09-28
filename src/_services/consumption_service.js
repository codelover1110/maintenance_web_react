import config from 'config';
import { fetchWrapper } from '../_helpers/fetch-wrapper';

const baseUrl = `${config.apiUrl}/users`;

export const consumptionService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getRemarkAll,
};

function getAll() {
    return fetchWrapper.get('http://localhost:8000/getConsumptions');
}

function getById(id) {
    return fetchWrapper.get(`http://localhost:8000/editConsumption/${id}`);
}

function create(params) {
    return fetchWrapper.post('http://localhost:8000/createConsumption/', params);
}

function update(id, params) {
    return fetchWrapper.post(`http://localhost:8000/updateConsumption/${id}`, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`http://localhost:8000/deleteConsumption/${id}`);
}

function getRemarkAll() {
    return fetchWrapper.get('http://localhost:8000/getRemarks');
}