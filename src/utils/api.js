import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://academy-server-f60a.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not on public pages to prevent loops
      const currentPath = window.location.pathname;
      const publicPages = ['/login', '/register', '/terms', '/drop-information', '/', '/courses'];
      const isPublicPage = publicPages.some(page => currentPath === page || currentPath.startsWith(page + '/'));
      
      if (!isPublicPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Use setTimeout to prevent multiple rapid redirects
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export default api;







