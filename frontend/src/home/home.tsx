import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import type { Todo } from "../interfaces/todo";
import type { TodoStatus } from "../interfaces/todo-status";
import apiClient from "../api/api-client";
import UpdateTodoModal from "./update-todo-modal";

function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [errors, setErrors] = useState<string | null>(null);
    const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
    const [draggedOverColumn, setDraggedOverColumn] = useState<TodoStatus | null>(null);
    const [draggedOverDelete, setDraggedOverDelete] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");
    const userData = useMemo(() => (storedUser ? JSON.parse(storedUser) : null), [storedUser]);
    const userId = userData?.id;

    const fetchTodos = useCallback(async () => {
        if (!userId) return;
        try {
            setIsFetching(true);
            const res = await apiClient.get<Todo[]>(`user/${userId}/todo/`);
            setTodos(res.data);
            setErrors(null);
        } catch (err: any) {
            setErrors(err.message);
            setTodos([]);
        } finally {
            setIsFetching(false);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }
        fetchTodos();
    }, [fetchTodos, navigate, userId]);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await apiClient.post("auth/logout", {});
            localStorage.removeItem("user");
            navigate("/login");
        } catch (err: any) {
            setErrors(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardClick = (todo: Todo) => {
        if (!isDragging) {
            setSelectedTodo(todo);
        }
    };

    const handleCloseModal = () => {
        setSelectedTodo(null);
    };

    const handleTodoUpdate = () => {
        fetchTodos();
    };

    const handleCreateTodo = () => {
        navigate("/create-todo");
    };

    const handleDragStart = (e: React.DragEvent, todo: Todo) => {
        setIsDragging(true);
        setDraggedTodo(todo);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", todo.id.toString());
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setDraggedTodo(null);
        setDraggedOverColumn(null);
        setDraggedOverDelete(false);
    };

    const handleDragOver = (e: React.DragEvent, status: TodoStatus) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDraggedOverColumn(status);
    };

    const handleDragLeave = () => {
        setDraggedOverColumn(null);
    };

    const handleDeleteDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDraggedOverDelete(true);
    };

    const handleDeleteDragLeave = () => {
        setDraggedOverDelete(false);
    };

    const handleDeleteDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setDraggedOverDelete(false);

        if (!draggedTodo || !userId) return;
        const updatedTodos = todos.filter(todo => todo.id !== draggedTodo.id);
        setTodos(updatedTodos);

        try {
            await apiClient.delete(`user/${userId}/todo/${draggedTodo.id}`);
            setErrors(null);
        } catch (err: any) {
            setTodos(todos);
            setErrors(err.message || "Failed to delete todo");
        } finally {
            setDraggedTodo(null);
        }
    };

    const handleDrop = async (e: React.DragEvent, targetStatus: TodoStatus) => {
        e.preventDefault();
        setDraggedOverColumn(null);

        if (!draggedTodo || !userId) return;
        if (draggedTodo.status === targetStatus) {
            setDraggedTodo(null);
            return;
        }
        const updatedTodos = todos.map(todo =>
            todo.id === draggedTodo.id ? { ...todo, status: targetStatus } : todo
        );
        setTodos(updatedTodos);

        try {
            await apiClient.patch(`user/${userId}/todo/${draggedTodo.id}`, {
                status: targetStatus,
            });
            setErrors(null);
        } catch (err: any) {
            setTodos(todos);
            setErrors(err.message || "Failed to update todo status");
        } finally {
            setDraggedTodo(null);
        }
    };

    const todosByStatus = useMemo(() => ({
        pending: todos.filter(t => t.status === "pending"),
        in_progress: todos.filter(t => t.status === "in_progress"),
        done: todos.filter(t => t.status === "done"),
    }), [todos]);

    return (
        <div className="home">
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-brand">
                        <div className="logo">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="brand-name">Todo Board</span>
                    </div>

                    <div className="nav-center">
                        <button onClick={handleCreateTodo} className="create-todo-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Create Todo
                        </button>
                    </div>

                    <div className="nav-actions">
                        <button onClick={handleLogout} className="sign-out-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {isLoading ? "Logging out..." : "Sign Out"}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="home-content">
                {isFetching ? (
                    <div className="home-loading">
                        <div className="home-spinner" />
                        <p>Fetching todos...</p>
                    </div>
                ) : todos.length > 0 ? (
                    <div className="todo-board">

                        <section
                            className={`todo-column ${draggedOverColumn === "pending" ? "drag-over" : ""}`}
                            onDragOver={(e) => handleDragOver(e, "pending")}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, "pending")}
                        >
                            <div className="todo-column-header pending">
                                Pending ({todosByStatus.pending.length})
                            </div>

                            {todosByStatus.pending.map(todo => (
                                <div
                                    key={todo.id}
                                    className={`todo-card ${draggedTodo?.id === todo.id ? "dragging" : ""}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, todo)}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => handleCardClick(todo)}
                                >
                                    <h3 className="todo-title">{todo.title}</h3>
                                    <p className="todo-description">{todo.description}</p>
                                    <div className="todo-date">
                                        {new Date(todo.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </section>

                        <section
                            className={`todo-column ${draggedOverColumn === "in_progress" ? "drag-over" : ""}`}
                            onDragOver={(e) => handleDragOver(e, "in_progress")}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, "in_progress")}
                        >
                            <div className="todo-column-header in_progress">
                                In Progress ({todosByStatus.in_progress.length})
                            </div>

                            {todosByStatus.in_progress.map(todo => (
                                <div
                                    key={todo.id}
                                    className={`todo-card ${draggedTodo?.id === todo.id ? "dragging" : ""}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, todo)}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => handleCardClick(todo)}
                                >
                                    <h3 className="todo-title">{todo.title}</h3>
                                    <p className="todo-description">{todo.description}</p>
                                    <div className="todo-date">
                                        {new Date(todo.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </section>

                        <section
                            className={`todo-column ${draggedOverColumn === "done" ? "drag-over" : ""}`}
                            onDragOver={(e) => handleDragOver(e, "done")}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, "done")}
                        >
                            <div className="todo-column-header done">
                                Done ({todosByStatus.done.length})
                            </div>

                            {todosByStatus.done.map(todo => (
                                <div
                                    key={todo.id}
                                    className={`todo-card ${draggedTodo?.id === todo.id ? "dragging" : ""}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, todo)}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => handleCardClick(todo)}
                                >
                                    <h3 className="todo-title">{todo.title}</h3>
                                    <p className="todo-description">{todo.description}</p>
                                    <div className="todo-date">
                                        {new Date(todo.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </section>

                    </div>
                ) : (
                    <div className="no-todos">
                        <p>No todos found. <Link to="/create-todo">Create your first todo</Link></p>
                    </div>
                )}

                {todos.length > 0 && (
                    <div
                        className={`delete-zone ${draggedOverDelete ? "drag-over" : ""} ${draggedTodo ? "active" : ""}`}
                        onDragOver={handleDeleteDragOver}
                        onDragLeave={handleDeleteDragLeave}
                        onDrop={handleDeleteDrop}
                    >
                        <div className="delete-zone-content">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 11V17M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="delete-zone-text">
                                {draggedOverDelete ? "Drop to delete" : "Drag here to delete"}
                            </p>
                        </div>
                    </div>
                )}
            </main>
            {errors && (
                <div className="error-message">
                    <p>{errors}</p>
                </div>
            )}

            {selectedTodo && userId && (
                <UpdateTodoModal
                    todo={selectedTodo}
                    userId={userId}
                    onClose={handleCloseModal}
                    onUpdate={handleTodoUpdate}
                />
            )}
        </div>
    );
}
export default Home;