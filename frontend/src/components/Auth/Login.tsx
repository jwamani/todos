import { Mail, Lock, ArrowRight, ListTodoIcon, Eye, EyeOff } from "lucide-preact"
import { useState } from "preact/hooks"
import { useAuth } from "../../hooks/useAuth"
import { route } from "preact-router"
import { login as loginAPI } from "../../api"

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { login } = useAuth()

    const handleSubmit = async (e: Event) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            // Call the real login API
            const token = await loginAPI(email, password)

            // Save token using auth context
            login(token)

            // Redirect to dashboard
            route("/dashboard")
        } catch (err) {
            // Display error message from API
            setError(err instanceof Error ? err.message : "Login failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="mb-2 flex flex-row justify-center gap-4 items-center">
                        <ListTodoIcon className="size-[30px] text-slate-700" />
                        <span className="text-3xl font-bold bg-gradient-to-r from bg-emerald-600 to-teal-600 bg-clip-text text-transparent ">
                            Tasker
                        </span>
                    </h1>
                    <p className="text-slate-600">Welcome back! Sign in to continue.</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Login to your account</h2>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>


                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                            {!isLoading && <ArrowRight className="h-5 w-5" />}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Don't have an account?{' '}
                            <a href="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                                Sign up for free
                            </a>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <a href="/" className="text-sm text-slate-600 hover:text-emerald-600 transition-colors">
                        ← Back to home
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Login
