import { X, Upload, FileText } from "lucide-preact"
import { useState, useEffect } from "preact/hooks"

interface TodoModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (todo: { title: string; description: string; priority: number }) => void
    editTodo?: {
        id: number
        title: string
        description: string | null
        priority: number
    } | null
}

function TodoModal({ isOpen, onClose, onSave, editTodo }: TodoModalProps) {
    const [title, setTitle] = useState(editTodo?.title || "")
    const [description, setDescription] = useState(editTodo?.description || "")
    const [priority, setPriority] = useState(editTodo?.priority || 3)
    const [isDragging, setIsDragging] = useState(false)
    const [fileError, setFileError] = useState("")
    const [fileWarning, setFileWarning] = useState("")

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
        setFileError("")
        setFileWarning("")
        onClose()
    }

    const handleFileRead = (file: File) => {
        setFileError("")
        setFileWarning("")

        // Validate file type
        if (!file.name.endsWith('.txt')) {
            setFileError('Only .txt files are supported')
            return
        }

        // Validate file size (max 1MB)
        if (file.size > 1024 * 1024) {
            setFileError('File too large. Maximum size is 1MB')
            return
        }

        // Read file content
        const reader = new FileReader()
        reader.onload = (event) => {
            const content = event.target?.result as string

            // Extract filename without extension
            let filename = file.name.replace('.txt', '')

            // Handle title length constraints (5-100 chars)
            if (filename.length < 5) {
                filename = `Task: ${filename}`
                setFileWarning('Filename was too short, added "Task: " prefix')
            }
            if (filename.length > 100) {
                filename = filename.substring(0, 100)
                setFileWarning('Filename was too long, truncated to 100 characters')
            }

            // Handle description length constraints (10-500 chars)
            let finalContent = content.trim()

            if (finalContent.length < 10) {
                finalContent = finalContent + '\n\n(Imported from file)'
                setFileWarning('Content was too short, added note')
            }
            if (finalContent.length > 500) {
                finalContent = finalContent.substring(0, 497) + '...'
                setFileWarning('Content was too long, truncated to 500 characters')
            }

            // Populate form fields
            setTitle(filename)
            setDescription(finalContent)
        }

        reader.onerror = () => {
            setFileError('Failed to read file. Please try again.')
        }

        reader.readAsText(file)
    }

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = e.dataTransfer?.files
        if (files && files.length > 0) {
            handleFileRead(files[0])
        }
    }

    const handleFileSelect = (e: Event) => {
        const input = e.target as HTMLInputElement
        const files = input.files
        if (files && files.length > 0) {
            handleFileRead(files[0])
        }
    }

    useEffect(() => {
        if (editTodo) {
            setTitle(editTodo.title)
            setDescription(editTodo.description || "")
            setPriority(editTodo.priority)
        } else {
            // Reset when creating new todo
            setTitle("")
            setDescription("")
            setPriority(3)
            setFileError("")
            setFileWarning("")
        }
    }, [editTodo, isOpen])


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
                    {/* File Upload Zone - Only show when creating new task */}
                    {!editTodo && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Quick Import from File (Optional)
                            </label>
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDragging
                                        ? 'border-teal-500 bg-teal-50'
                                        : 'border-slate-300 bg-slate-50 hover:border-teal-400'
                                    }`}
                            >
                                <input
                                    type="file"
                                    accept=".txt"
                                    onChange={handleFileSelect}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-3 bg-white rounded-lg">
                                        {isDragging ? (
                                            <Upload className="h-8 w-8 text-teal-600 animate-bounce" />
                                        ) : (
                                            <FileText className="h-8 w-8 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">
                                            {isDragging ? 'Drop your file here' : 'Drag & drop a text file'}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            or click to browse (.txt files only)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* File Error */}
                            {fileError && (
                                <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg">
                                    <p className="text-xs text-rose-600">{fileError}</p>
                                </div>
                            )}

                            {/* File Warning */}
                            {fileWarning && (
                                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-xs text-amber-600">{fileWarning}</p>
                                </div>
                            )}
                        </div>
                    )}

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
                                    ? "bg-rose-100 text-rose-700 border-2 border-rose-500"
                                    : "bg-white text-slate-600 border-2 border-slate-200 hover:border-rose-300"
                                    }`}
                            >
                                High
                            </button>
                            <button
                                type="button"
                                onClick={() => setPriority(2)}
                                className={`py-3 rounded-lg font-medium transition-all ${priority === 2
                                    ? "bg-amber-100 text-amber-700 border-2 border-amber-500"
                                    : "bg-white text-slate-600 border-2 border-slate-200 hover:border-amber-300"
                                    }`}
                            >
                                Medium
                            </button>
                            <button
                                type="button"
                                onClick={() => setPriority(3)}
                                className={`py-3 rounded-lg font-medium transition-all ${priority === 3
                                    ? "bg-sky-100 text-sky-700 border-2 border-sky-500"
                                    : "bg-white text-slate-600 border-2 border-slate-200 hover:border-sky-300"
                                    }`}
                            >
                                Low
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
