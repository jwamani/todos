import { Plus, LogOut, ListTodoIcon, CheckCircle2, Circle, Pencil, Trash2, Filter, Clock } from "lucide-preact"
import { useState, useEffect } from "preact/hooks"
import { route } from "preact-router"
import TodoModal from "./TodoModal"
import { useAuth } from "../hooks/useAuth"
import { getTodos, createTodo, updateTodo, deleteTodo, type Todo, type TodoCreate, type TodoUpdate } from "../api"

// Helper function to format relative time
const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
}

function Dashboard() {
    const { user, isAuthenticated, logout } = useAuth()
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
    const [todos, setTodos] = useState<Todo[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            route('/login')
        }
    }, [isAuthenticated])

    // Fetch todos on mount
    useEffect(() => {
        if (isAuthenticated) {
            loadTodos()
        }
    }, [isAuthenticated])

    const loadTodos = async () => {
        try {
            setIsLoading(true)
            setError("")
            const fetchedTodos = await getTodos()
            setTodos(fetchedTodos)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load todos")
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        route('/')
    }

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed
        if (filter === 'completed') return todo.completed
        return true
    })

    const handleSaveTodo = async (todoData: { title: string; description: string; priority: number }) => {
        try {
            setError("")

            if (editingTodo) {
                // Update existing todo
                const updates: TodoUpdate = {
                    title: todoData.title,
                    description: todoData.description,
                    priority: todoData.priority
                }
                const updatedTodo = await updateTodo(editingTodo.id, updates)
                setTodos(todos.map(todo => todo.id === editingTodo.id ? updatedTodo : todo))
                setEditingTodo(null)
            } else {
                // Create new todo
                const newTodoData: TodoCreate = {
                    title: todoData.title,
                    description: todoData.description,
                    priority: todoData.priority
                }
                const newTodo = await createTodo(newTodoData)
                setTodos([...todos, newTodo])
            }
            setIsModalOpen(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save todo")
        }
    }

    const handleEditTodo = (todo: Todo) => {
        setEditingTodo(todo)
        setIsModalOpen(true)
    }

    const handleDeleteTodo = async (id: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                setError("")
                await deleteTodo(id)
                setTodos(todos.filter(todo => todo.id !== id))
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to delete todo")
            }
        }
    }

    const handleToggleComplete = async (id: number) => {
        try {
            setError("")
            const todo = todos.find(t => t.id === id)
            if (!todo) return

            const updates: TodoUpdate = {
                completed: !todo.completed
            }
            const updatedTodo = await updateTodo(id, updates)
            setTodos(todos.map(t => t.id === id ? updatedTodo : t))
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update todo")
        }
    }

    const getPriorityColor = (priority: number) => {
        if (priority === 1) return 'bg-rose-100 text-rose-700 border-rose-300'
        if (priority === 2) return 'bg-amber-100 text-amber-700 border-amber-300'
        return 'bg-sky-100 text-sky-700 border-sky-300'
    }

    const getPriorityLabel = (priority: number) => {
        if (priority === 1) return 'High'
        if (priority === 2) return 'Medium'
        return 'Low'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50">
            {/* Header/Navbar */}
            <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <ListTodoIcon className="h-7 w-7 text-emerald-600" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Tasker
                            </h1>
                        </div>

                        {/* User Info & Logout */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-slate-700">
                                    {user?.email || 'User'}
                                </p>
                                <p className="text-xs text-slate-500">Logged in</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-rose-600 transition-colors rounded-lg hover:bg-slate-100"
                            >
                                <LogOut className="h-5 w-5" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">My Tasks</h2>
                    <p className="text-slate-600">Manage your todos and stay productive</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                        <p className="text-sm text-rose-600">{error}</p>
                    </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    {/* Add Todo Button */}
                    <button
                        onClick={() => {
                            setEditingTodo(null)
                            setIsModalOpen(true)
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Task
                    </button>

                    {/* Filter Buttons */}
                    <div className="flex gap-2 sm:ml-auto">
                        {isLoading && (
                            <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600">
                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent"></div>
                                Loading...
                            </div>
                        )}
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-7 py-2 rounded-lg hover:cursor-pointer font-medium transition-all ${filter === 'all'
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg hover:cursor-pointer font-medium transition-all ${filter === 'active'
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-4 py-2 rounded-lg font-medium hover:cursor-pointer transition-all ${filter === 'completed'
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Total Tasks</p>
                                <p className="text-2xl font-bold text-slate-900">{todos.length}</p>
                            </div>
                            <div className="p-3 bg-slate-100 rounded-lg">
                                <ListTodoIcon className="h-6 w-6 text-slate-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-teal-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-teal-600">Active</p>
                                <p className="text-2xl font-bold text-teal-700">{todos.filter(t => !t.completed).length}</p>
                            </div>
                            <div className="p-3 bg-teal-100 rounded-lg">
                                <Circle className="h-6 w-6 animate-pulse text-teal-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-emerald-600">Completed</p>
                                <p className="text-2xl font-bold text-emerald-700">{todos.filter(t => t.completed).length}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 rounded-lg">
                                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Todo List */}
                <div className="space-y-3">
                    {filteredTodos.length === 0 ? (
                        // Empty State
                        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
                            <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
                                <ListTodoIcon className="h-12 w-12 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No tasks found</h3>
                            <p className="text-slate-600 mb-6">
                                {filter === 'all'
                                    ? "Get started by creating your first task!"
                                    : `No ${filter} tasks at the moment.`}
                            </p>
                            <button
                                onClick={() => {
                                    setEditingTodo(null)
                                    setIsModalOpen(true)
                                }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md"
                            >
                                <Plus className="h-5 w-5" />
                                Create Task
                            </button>
                        </div>
                    ) : (
                        filteredTodos.map((todo) => (
                            <div
                                key={todo.id}
                                className={`bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-all ${todo.completed ? 'border-slate-200 opacity-75' : 'border-slate-200'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => handleToggleComplete(todo.id)}
                                        className="mt-1 flex-shrink-0"
                                    >
                                        {todo.completed ? (
                                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                        ) : (
                                            <Circle className="h-6 w-6 text-slate-400 hover:text-emerald-600 transition-colors" />
                                        )}
                                    </button>

                                    {/* Content */}
                                    <div className="flex-grow">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-slate-500' : 'text-slate-900'
                                                }`}>
                                                {todo.title}
                                            </h3>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${getPriorityColor(todo.priority)
                                                }`}>
                                                {getPriorityLabel(todo.priority)}
                                            </span>
                                        </div>
                                        <p className={`text-sm mb-3 ${todo.completed ? 'text-slate-400' : 'text-slate-600'
                                            }`}>
                                            {todo.description}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditTodo(todo)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTodo(todo.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </button>
                                            <div className="ml-auto text-sm text-left">
                                                <span className={`items-center flex-row flex gap-3 ${todo.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                                                    <Clock />
                                                    {formatRelativeTime(todo.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Todo Modal */}
            <TodoModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingTodo(null)
                }}
                onSave={handleSaveTodo}
                editTodo={editingTodo}
            />
        </div>
    )
}

export default Dashboard
