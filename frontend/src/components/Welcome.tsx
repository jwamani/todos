import { Clipboard, CheckCircle2, LockKeyhole, ListTodoIcon } from "lucide-preact"
import { useAuth } from "../hooks/useAuth"
import { useEffect } from "preact/hooks"
import { route } from "preact-router"

function Welcome() {
    const { isAuthenticated } = useAuth()

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            route('/dashboard')
        }
    }, [isAuthenticated])
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-screen mx-auto px-4 sm:px-6 lg:mx-20">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex gap-2 sm:gap-3 items-center">
                            <ListTodoIcon className="text-slate-700 size-6 sm:size-[30px]" />
                            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Tasker
                            </span>
                        </div>
                        <div className="flex gap-2 sm:gap-4">
                            <a href="/login" className="px-3 py-2 sm:px-4 text-sm sm:text-base text-slate-700 font-medium hover:text-emerald-600 transition-colors">
                                Login
                            </a>
                            <a href="/register" className="px-4 py-2 sm:px-6 text-sm sm:text-base bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-md">
                                Sign Up
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center">
                    <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
                        Organize Your Life,{' '}
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            One Task at a Time
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
                        A simple, powerful todo app to help you stay productive and achieve your goals.
                        Track tasks, set priorities, and never miss a deadline.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <a href="/register" className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl">
                            Get Started Free
                        </a>
                        <a href="/login" className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-md border border-slate-200">
                            Learn More
                        </a>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-20 grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                            <Clipboard className="text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Easy Task Management</h3>
                        <p className="text-slate-600">
                            Create, organize, and prioritize your tasks with an intuitive interface.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                            <CheckCircle2 className="text-teal-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Priority Levels</h3>
                        <p className="text-slate-600">
                            Set priorities from 1-3 to focus on what matters most.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                            <LockKeyhole className="text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Secure & Private</h3>
                        <p className="text-slate-600">
                            Your data is protected with JWT authentication and encryption.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-slate-600">
                        <p>&copy; 2025 Tasker. Built with FastAPI & Preact.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Welcome