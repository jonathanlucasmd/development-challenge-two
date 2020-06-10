import axios from 'axios';

const api = axios.create({
  baseURL: process.env.MEDCLOUD_API_URL,
});

export default api;
