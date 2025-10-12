import { Plus, LogOut, ListTodoIcon, CheckCircle2, Circle, Pencil, Trash2, Filter, Clock } from "lucide-preact"
import { useState } from "preact/hooks"
import TodoModal from "./TodoModal"
import { todo } from "node:test"

// Mock data for demonstration (matches backend schema)
const mockTodos = [
    {
        id: 1,
        title: "Complete project documentation",
        description: "Write comprehensive docs for the API",
        priority: 3,
        completed: false,
        owner_id: 1,
        created_at: "2025-10-12T10:30:00",
        updated_at: null
    },
    {
        id: 2,
        title: "Review pull requests",
        description: "Check and approve pending PRs",
        priority: 2,
        completed: true,
        owner_id: 1,
        created_at: "2025-10-11T14:20:00",
        updated_at: "2025-10-12T09:15:00"
    },
    {
        id: 3,
        title: "Update dependencies",
        description: "Update all npm packages to latest versions",
        priority: 1,
        completed: false,
        owner_id: 1,
        created_at: "2025-10-10T16:45:00",
        updated_at: null
    },
    {
        id: 4,
        title: "Fix responsive design bugs",
        description: "Mobile view needs adjustments",
        priority: 3,
        completed: false,
        owner_id: 1,
        created_at: "2025-10-12T08:00:00",
        updated_at: "2025-10-12T11:30:00"
    },
]

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
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
    const [todos, setTodos] = useState(mockTodos)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTodo, setEditingTodo] = useState<typeof mockTodos[0] | null>(null)

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed
        if (filter === 'completed') return todo.completed
        return true
    })

    const handleSaveTodo = (todoData: { title: string; description: string; priority: number }) => {
        if (editingTodo) {
            // Update existing todo
            setTodos(todos.map(todo =>
                todo.id === editingTodo.id
                    ? { ...todo, ...todoData, updated_at: new Date().toISOString() }
                    : todo
            ))
            setEditingTodo(null)
        } else {
            // Create new todo
            const newTodo = {
                id: Math.max(...todos.map(t => t.id), 0) + 1,
                ...todoData,
                completed: false,
                owner_id: 1,
                created_at: new Date().toISOString(),
                updated_at: null
            }
            setTodos([...todos, newTodo])
        }
        setIsModalOpen(false)
    }

    const handleEditTodo = (todo: typeof mockTodos[0]) => {
        setEditingTodo(todo)
        setIsModalOpen(true)
    }

    const handleDeleteTodo = (id: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            setTodos(todos.filter(todo => todo.id !== id))
        }
    }

    const handleToggleComplete = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id
                ? { ...todo, completed: !todo.completed, updated_at: new Date().toISOString() }
                : todo
        ))
    }

    const getPriorityColor = (priority: number) => {
        if (priority === 3) return 'bg-rose-100 text-rose-700 border-rose-300'
        if (priority === 2) return 'bg-amber-100 text-amber-700 border-amber-300'
        return 'bg-sky-100 text-sky-700 border-sky-300'
    }

    const getPriorityLabel = (priority: number) => {
        if (priority === 3) return 'Urgent'
        if (priority === 2) return 'Medium'
        return 'Low'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50">
            {/* Header/Navbar */}
            <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                <p className="text-sm font-medium text-slate-700">John Doe</p>
                                <p className="text-xs text-slate-500">john@example.com</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-rose-600 transition-colors rounded-lg hover:bg-slate-100">
                                <LogOut className="h-5 w-5" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">My Tasks</h2>
                    <p className="text-slate-600">Manage your todos and stay productive</p>
                </div>

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
