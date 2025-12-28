export const TodoStatus = {
    PENDING: "pending",
    IN_PROGRESS: "in_progress",
    DONE: "done",
} as const;

export type TodoStatus = typeof TodoStatus[keyof typeof TodoStatus];
