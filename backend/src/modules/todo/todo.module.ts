import { Module } from "@nestjs/common";
import { TodoController } from "./Todo.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodoService } from "./todo.service";
import { User } from "../user/entity/user.entity";
import { Todo } from "../user/entity/todo.entity";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: 'jwt-service',
                signOptions: { expiresIn: '24hr' },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User, Todo]),
    ],
    controllers: [TodoController],
    providers: [TodoService]
})
export class TodoModule {

}