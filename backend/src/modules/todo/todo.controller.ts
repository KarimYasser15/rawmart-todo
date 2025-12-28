import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CurrentUser } from "../../decorators/current-user";
import { JwtPayload } from "../../interfaces/jwt-payload.interface";
import { MessageDto } from "../dtos/message.dto";
import { TodoService } from "./todo.service";
import { GetTodoResponseDto } from "./dtos/get-todo-response.dto";
import { CreateTodoDto } from "./dtos/create-todo-request.dto";
import { UpdateTodoDto } from "./dtos/update-todo-request.dto";

@Controller('/user/:userId/todo/')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Post('')
    public async createTodo(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Body() createTodoDto: CreateTodoDto): Promise<GetTodoResponseDto> {
        return this.todoService.createTodo(userPayload, userId, createTodoDto);
    }

    @Get('/:todoId')
    public async getTodoById(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Param('todoId', ParseIntPipe) todoId: number): Promise<GetTodoResponseDto> {
        return this.todoService.getTodoById(userPayload, userId, todoId);
    }

    @Get('')
    public async getAllTodos(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number): Promise<GetTodoResponseDto[]> {
        return this.todoService.getAllTodos(userPayload, userId);
    }

    @Delete('/:todoId')
    public async deleteTodo(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Param('todoId', ParseIntPipe) todoId: number): Promise<MessageDto> {
        return this.todoService.deleteTodo(userPayload, userId, todoId);
    }
    @Patch('/:todoId')
    public async updateTodo(@CurrentUser() userPayload: JwtPayload, @Param('userId', ParseIntPipe) userId: number, @Param('todoId', ParseIntPipe) todoId: number, @Body() updateTodoDto: UpdateTodoDto): Promise<GetTodoResponseDto> {
        return this.todoService.updateTodo(userPayload, userId, todoId, updateTodoDto);
    }

}