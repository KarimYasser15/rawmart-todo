import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import "./update-todo-modal.css";
import apiClient from "../api/api-client";
import type { Todo } from "../interfaces/todo";
import type { TodoStatus } from "../interfaces/todo-status";

interface UpdateTodoModalProps {
    todo: Todo | null;
    userId: number;
    onClose: () => void;
    onUpdate: () => void;
}

interface UpdateTodoFormData {
    title: string;
    description: string;
    status: TodoStatus;
}

interface FormErrors {
    title?: string;
    description?: string;
    api?: string;
}

function UpdateTodoModal({ todo, userId, onClose, onUpdate }: UpdateTodoModalProps) {
    const [formData, setFormData] = useState<UpdateTodoFormData>({
        title: "",
        description: "",
        status: "pending",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (todo) {
            setFormData({
                title: todo.title,
                description: todo.description || "",
                status: todo.status,
            });
            setErrors({});
        }
    }, [todo]);

    useEffect(() => {
        if (todo) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [todo]);

    const validateForm = () => {
        const formErrors: FormErrors = {};
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
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm() || !todo) return;

        setIsLoading(true);
        setErrors({});
        try {
            await apiClient.patch(`user/${userId}/todo/${todo.id}`, {
                title: formData.title.trim(),
                description: formData.description.trim(),
                status: formData.status,
            });
            onUpdate();
            onClose();
        } catch (error: any) {
            const message = error?.response?.data?.message ?? error?.message ?? "Failed to update todo";
            setErrors({ api: message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!todo) return null;

    return (
        <div className="update-todo-modal-overlay" onClick={handleBackdropClick}>
            <div className="update-todo-modal" onClick={(e) => e.stopPropagation()}>
                <div className="update-todo-modal-header">
                    <h2>Update Todo</h2>
                    <button onClick={onClose} className="update-todo-modal-close" type="button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                {errors.api && <div className="update-todo-modal-alert">{errors.api}</div>}

                <form className="update-todo-modal-form" onSubmit={handleSubmit}>
                    <div className="update-todo-modal-field">
                        <label htmlFor="modal-title">Title *</label>
                        <input
                            id="modal-title"
                            type="text"
                            name="title"
                            placeholder="Enter todo title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`update-todo-modal-input${errors.title ? " error" : ""}`}
                            maxLength={100}
                            autoFocus
                        />
                        <div className="update-todo-modal-field-footer">
                            {errors.title && <span className="update-todo-modal-error">{errors.title}</span>}
                            <span className="update-todo-modal-counter">{formData.title.length}/100</span>
                        </div>
                    </div>

                    <div className="update-todo-modal-field">
                        <label htmlFor="modal-description">Description</label>
                        <textarea
                            id="modal-description"
                            name="description"
                            placeholder="Enter todo description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`update-todo-modal-textarea${errors.description ? " error" : ""}`}
                            rows={5}
                            maxLength={255}
                        />
                        <div className="update-todo-modal-field-footer">
                            {errors.description && <span className="update-todo-modal-error">{errors.description}</span>}
                            <span className="update-todo-modal-counter">{formData.description.length}/255</span>
                        </div>
                    </div>

                    <div className="update-todo-modal-field">
                        <label htmlFor="modal-status">Status</label>
                        <select
                            id="modal-status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="update-todo-modal-select"
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    <div className="update-todo-modal-actions">
                        <button type="button" onClick={onClose} className="update-todo-modal-cancel" disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="update-todo-modal-submit" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Todo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateTodoModal;

