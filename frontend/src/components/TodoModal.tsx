import { X } from "lucide-preact"
import { useState } from "preact/hooks"

interface TodoModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (todo: { title: string; description: string; priority: number }) => void
    editTodo?: {
        id: number
        title: string
        description: string
        priority: number
    } | null
}

function TodoModal({ isOpen, onClose, onSave, editTodo }: TodoModalProps) {
    const [title, setTitle] = useState(editTodo?.title || "")
    const [description, setDescription] = useState(editTodo?.description || "")
    const [priority, setPriority] = useState(editTodo?.priority || 3)

    if (!isOpen) return null

    const handleSubmit = (e: Event) => {
        e.preventDefault()
        onSave({ title, description, priority })
        handleClose()
    }

    const handleClose = () => {
        setTitle("")
        setDescription("")
        setPriority(3)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
            {/* Modal */}
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {editTodo ? "Edit Task" : "Create New Task"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
                            placeholder="Enter task title (min 5 characters)"
                            required
                            minLength={5}
                            maxLength={100}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors resize-none"
                            placeholder="Enter task description (min 10 characters)"
                            rows={4}
                            required
                            minLength={10}
                            maxLength={500}
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            Priority Level *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setPriority(1)}
                                className={`py-3 rounded-lg font-medium transition-all ${priority === 1
                                        ? "bg-sky-100 text-sky-700 border-2 border-sky-500"
                                        : "bg-white text-slate-600 border-2 border-slate-200 hover:border-sky-300"
                                    }`}
                            >
                                Low (1)
                            </button>
                            <button
                                type="button"
                                onClick={() => setPriority(2)}
                                className={`py-3 rounded-lg font-medium transition-all ${priority === 2
                                        ? "bg-amber-100 text-amber-700 border-2 border-amber-500"
                                        : "bg-white text-slate-600 border-2 border-slate-200 hover:border-amber-300"
                                    }`}
                            >
                                Medium (2)
                            </button>
                            <button
                                type="button"
                                onClick={() => setPriority(3)}
                                className={`py-3 rounded-lg font-medium transition-all ${priority === 3
                                        ? "bg-rose-100 text-rose-700 border-2 border-rose-500"
                                        : "bg-white text-slate-600 border-2 border-slate-200 hover:border-rose-300"
                                    }`}
                            >
                                High (3)
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md"
                        >
                            {editTodo ? "Update Task" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TodoModal
