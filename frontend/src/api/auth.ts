import { apiClient } from './client';

// Response types from your backend
interface LoginResponse {
    access_token: string;
    token_type: string;
}

interface RegisterResponse {
    data: {
        id: number;
        email: string;
    };
}

/**
 * Login user with email and password
 * Backend expects: OAuth2 form data (application/x-www-form-urlencoded)
 */
export async function login(email: string, password: string): Promise<string> {
    // Create FormData for OAuth2 format
    // Backend expects: username and password (even though we use email)
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 uses 'username' field
    formData.append('password', password);

    const response = await apiClient.post<LoginResponse>('/token', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return response.data.access_token;
}

/**
 * Register new user
 * Backend expects: JSON with email and password
 */
export async function register(email: string, password: string): Promise<void> {
    const response = await apiClient.post<RegisterResponse>('/users', {
        email,
        password,
    });

    // Registration successful
    // User can now login with these credentials
    return;
}
