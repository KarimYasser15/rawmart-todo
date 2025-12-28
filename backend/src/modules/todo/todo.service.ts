import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entity/user.entity";
import { JwtPayload } from "../../interfaces/jwt-payload.interface";
import { MessageDto } from "../dtos/message.dto";
import { UpdateTodoDto } from "./dtos/update-todo-request.dto";
import { GetTodoResponseDto } from "./dtos/get-todo-response.dto";
import { Todo } from "../user/entity/todo.entity";
import { CreateTodoDto } from "./dtos/create-todo-request.dto";

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }


    public async createTodo(userPayload: JwtPayload, userId: number, createTodoDto: CreateTodoDto): Promise<GetTodoResponseDto> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const todo = this.todoRepository.create({ ...createTodoDto, createdBy: user, });
        const savedEvent = await this.todoRepository.save(todo);
        return GetTodoResponseDto.fromEntity(savedEvent);
    }
    public async getTodoById(userPayload: JwtPayload, userId: number, todoId: number): Promise<GetTodoResponseDto> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const todo = await this.todoRepository.findOne({ where: { id: todoId }, relations: ["createdBy"], });
        if (!todo) {
            throw new NotFoundException("todo not found");
        }
        return todo;
    }
    public async getAllTodos(userPayload: JwtPayload, userId: number): Promise<GetTodoResponseDto[]> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const todos = await this.todoRepository.find({
            order: { id: "DESC" },
        });

        if (!todos.length) {
            throw new NotFoundException("No todos found");
        }
        return todos.map((todo) => GetTodoResponseDto.fromEntity(todo));
    }
    public async deleteTodo(userPayload: JwtPayload, userId: number, todoId: number): Promise<MessageDto> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const todo = await this.todoRepository.findOne({ where: { id: todoId } });

        if (!todo) {
            throw new NotFoundException("Todo Not Found");
        }
        await this.todoRepository.remove(todo);
        return {
            message: "Todo Deleted"
        };
    }
    public async updateTodo(
        userPayload: JwtPayload,
        userId: number,
        todoId: number,
        updateTodoDto: UpdateTodoDto,
    ): Promise<GetTodoResponseDto> {
        if (userPayload.id !== userId) {
            throw new UnauthorizedException("Unauthorized");
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const todo = await this.todoRepository.findOne({ where: { id: todoId }, relations: ["createdBy"] });
        if (!todo) {
            throw new NotFoundException("Todo not found");
        }
        Object.assign(todo, updateTodoDto);
        const updatedTodo = await this.todoRepository.save(todo);
        return GetTodoResponseDto.fromEntity(updatedTodo);
    }

}