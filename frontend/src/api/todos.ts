import { apiClient } from './client';

// Types matching your backend schemas
export interface Todo {
    id: number;
    title: string;
    description: string | null;
    priority: number; // Backend uses 1=high, 2=medium, 3=low
    completed: boolean;
    owner_id: number;
    created_at: string;
    updated_at: string | null;
}

interface TodosResponse {
    results: number;
    data: Todo[];
}

interface TodoResponse {
    data: Todo;
}

export interface TodoCreate {
    title: string;
    description?: string;
    priority: number; // 1=high, 2=medium, 3=low
}

export interface TodoUpdate {
    title?: string;
    description?: string;
    priority?: number; // 1=high, 2=medium, 3=low
    completed?: boolean;
}

/**
 * Get all todos for the authenticated user
 */
export async function getTodos(skip: number = 0, limit: number = 50): Promise<Todo[]> {
    const response = await apiClient.get<TodosResponse>('/todos', {
        params: { skip, limit },
    });
    return response.data.data;
}

/**
 * Get a single todo by ID
 */
export async function getTodo(todoId: number): Promise<Todo> {
    const response = await apiClient.get<TodoResponse>(`/todos/${todoId}`);
    return response.data.data;
}

/**
 * Create a new todo
 */
export async function createTodo(todo: TodoCreate): Promise<Todo> {
    const response = await apiClient.post<TodoResponse>('/todos', todo);
    return response.data.data;
}

/**
 * Update an existing todo
 */
export async function updateTodo(todoId: number, updates: TodoUpdate): Promise<Todo> {
    const response = await apiClient.put<TodoResponse>(`/todos/${todoId}`, updates);
    return response.data.data;
}

/**
 * Delete a todo
 */
export async function deleteTodo(todoId: number): Promise<void> {
    await apiClient.delete(`/todos/${todoId}`);
}
