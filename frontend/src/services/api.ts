import axios from 'axios';

const api = axios.create({
  baseURL: 'https://f8unwj6cal.execute-api.us-east-1.amazonaws.com/dev',
});

export default api;
