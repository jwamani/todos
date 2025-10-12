import './app.css'
import Welcome from './components/Welcome'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Dashboard from './components/Dashboard'

export function App() {
    // Toggle between pages for now
    // Change this to: 'welcome' | 'login' | 'register' | 'dashboard'
    const currentPage: 'welcome' | 'login' | 'register' | 'dashboard' = 'dashboard'

    return (
        <>
            {currentPage === 'welcome' && <Welcome />}
            {currentPage === 'login' && <Login />}
            {currentPage === 'register' && <Register />}
            {currentPage === 'dashboard' && <Dashboard />}
        </>
    )
}
