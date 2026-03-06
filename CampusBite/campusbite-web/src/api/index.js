import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

// Request interceptor to attach JWT token to headers automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
