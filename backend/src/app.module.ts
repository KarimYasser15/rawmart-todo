import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './modules/user/entity/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { TodoModule } from './modules/todo/todo.module';
import { Todo } from './modules/user/entity/todo.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DATABASE_HOST'),
                port: Number(configService.get('DATABASE_PORT')),
                username: configService.get('DATABASE_USERNAME'),
                password: configService.get('DATABASE_PASSWORD'),
                database: configService.get('DATABASE_NAME'),
                entities: [
                    User,
                    Todo
                ],
                synchronize: configService.get('DATABASE_SYNCHRONIZE') === 'true',
                ssl: false,
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        TodoModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }