import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { TodoStatus } from "../../todo/enums/todo-status.enum";

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, })
    title: string;

    @Column({ type: 'varchar', length: 255, })
    description: string;

    @Column({
        type: 'enum',
        enum: TodoStatus,
        default: TodoStatus.PENDING,
    })
    status: TodoStatus;

    @ManyToOne(() => User, (user) => user.todos, { eager: true })
    createdBy: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}