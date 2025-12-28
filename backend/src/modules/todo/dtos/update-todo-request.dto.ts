import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TodoStatus } from '../enums/todo-status.enum';

export class UpdateTodoDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @IsOptional()
    @IsEnum(TodoStatus, { message: 'Status must be one of: pending, in_progress, done' })
    status?: TodoStatus;
}
