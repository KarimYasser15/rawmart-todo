import type { TodoStatus } from "./todo-status";

export interface CreateTodoFormData {
    title: string;
    description: string;
    status: TodoStatus;
}
