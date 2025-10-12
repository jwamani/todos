import './app.css'
import Welcome from './components/Welcome'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Dashboard from './components/Dashboard'
import { Router, Route } from "preact-router"
import { AuthProvider } from './context/AuthContext'

export function App() {
    return (
        <AuthProvider>
            <Router>
                <Route path="/" component={Welcome} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/dashboard" component={Dashboard} />
            </Router>
        </AuthProvider>
    )
}
