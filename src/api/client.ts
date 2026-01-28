import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    if (config.method === 'get') {
      config.params = { ...config.params, userId: 1 };
    } else {
      config.data = { ...config.data, userId: 1 };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default client;
