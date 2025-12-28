import { useState, type ChangeEvent, type FormEvent, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./create-todo.css";
import apiClient from "../api/api-client";
import type { CreateTodoFormData } from "../interfaces/create-todo.interface";
import type { CreateTodoFormErrors } from "../interfaces/create-form-error.interface";


function CreateTodo() {
    const [formData, setFormData] = useState<CreateTodoFormData>({
        title: "",
        description: "",
        status: "pending",
    });
    const [errors, setErrors] = useState<CreateTodoFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");
    const userData = useMemo(() => (storedUser ? JSON.parse(storedUser) : null), [storedUser]);
    const userId = userData?.id;

    useEffect(() => {
        if (!userId) {
            navigate("/login");
        }
    }, [userId, navigate]);

    const validateForm = () => {
        const formErrors: CreateTodoFormErrors = {};
        if (!formData.title.trim()) {
            formErrors.title = "Title is required";
        } else if (formData.title.length > 100) {
            formErrors.title = "Title must be 100 characters or less";
        }
        if (formData.description.length > 255) {
            formErrors.description = "Description must be 255 characters or less";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof CreateTodoFormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm() || !userId) return;

        setIsLoading(true);
        setErrors({});
        try {
            await apiClient.post(`user/${userId}/todo/`, {
                title: formData.title.trim(),
                description: formData.description.trim(),
                status: formData.status,
            });
            navigate("/home");
        } catch (error: any) {
            const message = error?.response?.data?.message ?? error?.message ?? "Failed to create todo";
            setErrors({ api: message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/home");
    };

    if (!userId) {
        return null;
    }

    return (
        <div className="create-todo-page">
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
                </div>
            </nav>

            <main className="create-todo-content">
                <div className="create-todo-card">
                    <div className="create-todo-header">
                        <h1>Create New Todo</h1>
                    </div>

                    {errors.api && <div className="create-todo-alert">{errors.api}</div>}

                    <form className="create-todo-form" onSubmit={handleSubmit}>
                        <div className="create-todo-field">
                            <label htmlFor="title">Title *</label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                placeholder="Enter todo title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`create-todo-input${errors.title ? " error" : ""}`}
                                maxLength={100}
                                autoFocus
                            />
                            <div className="create-todo-field-footer">
                                {errors.title && <span className="create-todo-error">{errors.title}</span>}
                                <span className="create-todo-counter">{formData.title.length}/100</span>
                            </div>
                        </div>

                        <div className="create-todo-field">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Enter todo description"
                                value={formData.description}
                                onChange={handleChange}
                                className={`create-todo-textarea${errors.description ? " error" : ""}`}
                                rows={6}
                                maxLength={255}
                            />
                            <div className="create-todo-field-footer">
                                {errors.description && <span className="create-todo-error">{errors.description}</span>}
                                <span className="create-todo-counter">{formData.description.length}/255</span>
                            </div>
                        </div>

                        <div className="create-todo-field">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="create-todo-select"
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div className="create-todo-actions">
                            <button type="button" onClick={handleCancel} className="create-todo-cancel" disabled={isLoading}>
                                Cancel
                            </button>
                            <button type="submit" className="create-todo-submit" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create Todo"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default CreateTodo;

