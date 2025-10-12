import { Mail, Lock, UserPlus, ArrowRight, ListTodoIcon, Eye, EyeOff } from "lucide-preact"
import { useState } from "preact/hooks"
import { route } from "preact-router"
import { register as registerAPI, login as loginAPI } from "../../api"
import { useAuth } from "../../hooks/useAuth"

function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { login } = useAuth()

    const handleSubmit = async (e: Event) => {
        e.preventDefault()
        setError("")

        // Validation
        if (!email || !password || !confirmPassword) {
            setError("Please fill in all fields")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }

        if (!agreedToTerms) {
            setError("Please agree to the Terms and Privacy Policy")
            return
        }

        setIsLoading(true)

        try {
            // Register the user
            await registerAPI(email, password)

            // Auto-login after successful registration
            const token = await loginAPI(email, password)
            login(token)

            // Redirect to dashboard
            route("/dashboard")
        } catch (err) {
            // Display error message from API
            setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
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
                    <p className="text-slate-600">Create your account and start organizing!</p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg">
                            <UserPlus className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                                <p className="text-sm text-rose-600">{error}</p>
                            </div>
                        )}

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
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">We'll never share your email with anyone.</p>
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
                                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
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
                            <p className="mt-1 text-xs text-slate-500">Must be at least 8 characters long.</p>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onInput={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
                                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms((e.target as HTMLInputElement).checked)}
                                className="w-4 h-4 mt-1 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
                                I agree to the{' '}
                                <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                            {!isLoading && <ArrowRight className="h-5 w-5" />}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Already have an account?{' '}
                            <a href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                                Sign in
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

export default Register
