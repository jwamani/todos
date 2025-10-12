import axios from 'axios';

// Base URL for your backend API
const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - adds token to every request
apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('auth_token');

        // If token exists, add it to Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handles common errors
apiClient.interceptors.response.use(
    (response) => {
        // If response is successful, just return it
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const message = error.response.data?.detail || error.message;

            switch (status) {
                case 401:
                    // Unauthorized - token expired or invalid
                    console.error('Authentication failed:', message);
                    // Clear invalid token
                    localStorage.removeItem('auth_token');
                    // Only redirect to login if not already there
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    console.error('Access forbidden:', message);
                    break;
                case 404:
                    console.error('Resource not found:', message);
                    break;
                case 409:
                    // Conflict - e.g., email already exists
                    console.error('Conflict:', message);
                    break;
                case 500:
                case 503:
                    console.error('Server error:', message);
                    break;
                default:
                    console.error('API error:', message);
            }

            // Re-throw with clean error message
            throw new Error(message);
        } else if (error.request) {
            // Request made but no response received
            console.error('No response from server');
            throw new Error('Cannot connect to server. Please check if backend is running.');
        } else {
            // Something else happened
            console.error('Request error:', error.message);
            throw error;
        }
    }
);
