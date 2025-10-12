import { createContext } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

// Define what a User looks like (matches your backend)
interface User {
    id: number;
    email: string;
}

// Define what our Auth Context will provide
interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

// Create the Context (initially empty)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps your app
export function AuthProvider({ children }: { children: ComponentChildren }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // On mount, check if there's a saved token in localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        if (savedToken) {
            setToken(savedToken);

            // JWT format: header.payload.signature
            try {
                const payload = JSON.parse(atob(savedToken.split('.')[1]));

                setUser({
                    id: 0,
                    email: payload.subject, // 'subject' contains the email
                });
            } catch (error) {
                // If token is invalid, clear it
                console.error('Invalid token:', error);
                localStorage.removeItem('auth_token');
            }
        }
    }, []);

    // Login function - saves token and decodes user info
    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('auth_token', newToken);

        // Decode token to get user info
        try {
            const payload = JSON.parse(atob(newToken.split('.')[1]));

            setUser({
                id: 0, 
                email: payload.subject, // 'subject' contains the email
            });
        } catch (error) {
            console.error('Failed to decode token:', error);
        }
    };

    // Logout function - clears everything
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
    };

    // Calculate isAuthenticated from token presence
    const isAuthenticated = token !== null;

    // Provide the auth state to all children
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
