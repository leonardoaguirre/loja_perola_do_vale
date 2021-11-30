import axios from 'axios';

const apiWithAuth = (authorization) => axios.create({
    baseURL: 'http://localhost:3008/',
    headers: { 'Authorization': 'Bearer ' + authorization }
});

export default apiWithAuth;