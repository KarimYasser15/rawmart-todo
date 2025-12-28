import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TodoStatus } from '../enums/todo-status.enum';

export class CreateTodoDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    title: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    description: string;

    @IsOptional()
    @IsEnum(TodoStatus, { message: 'Status must be one of: pending, in_progress, done' })
    status?: TodoStatus;
}
