import config from 'config';
import { fetchWrapper } from '../_helpers/fetch-wrapper';

const baseUrl = `${config.apiUrl}/users`;

export const metadataService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getMetaActivity,
    getAllArchive,
    getMaintenance
};

function getAll() {
    return fetchWrapper.get('http://localhost:8000/getMetaMainDatas');
}

function getAllArchive() {
    return fetchWrapper.get('http://localhost:8000/getMetaArchiveDatas');
}

function getById(id) {
    return fetchWrapper.get(`http://localhost:8000/editMetaMainData/${id}`);
}

function create(params) {
    return fetchWrapper.post('http://localhost:8000/createMetaMainData/', params);
}

function update(id, params) {
    return fetchWrapper.post(`http://localhost:8000/updateMetaMainData/${id}`, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`http://localhost:8000/deleteMetaMainData/${id}`);
}



function getMetaActivity(id) {
    return fetchWrapper.get(`http://localhost:8000/getMetaActivity/${id}`);
}



function getMaintenance() {
    return fetchWrapper.get(`http://localhost:8000/getMaintenance`);
}
