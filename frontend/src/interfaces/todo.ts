import type { TodoStatus } from "./todo-status";

export interface Todo {
    id: number;
    title: string;
    description: string;
    status: TodoStatus;
    createdAt: Date;
}
