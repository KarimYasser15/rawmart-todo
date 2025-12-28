import { Todo } from "src/modules/user/entity/todo.entity";
import { User } from "src/modules/user/entity/user.entity";
import { TodoStatus } from "../enums/todo-status.enum";

export class GetTodoResponseDto {
    id: number;
    title: string;
    description: string;
    status: TodoStatus;
    createdBy: User;
    createdAt: Date;

    static fromEntity(todoEntity: Todo): GetTodoResponseDto {
        const getTodoDto = new GetTodoResponseDto();
        getTodoDto.id = todoEntity.id;
        getTodoDto.title = todoEntity.title;
        getTodoDto.description = todoEntity.description;
        getTodoDto.status = todoEntity.status;
        getTodoDto.createdAt = todoEntity.createdAt;
        return getTodoDto;
    }
}
