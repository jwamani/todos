import { useContext } from 'preact/hooks';
import { AuthContext } from '../context/AuthContext';

// Custom hook to access auth context easily
export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
