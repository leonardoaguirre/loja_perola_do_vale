import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3008/'
});

export default api;