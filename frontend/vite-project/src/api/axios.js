import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',  // Adjust this to Docker URL later
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
