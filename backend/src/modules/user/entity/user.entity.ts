import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Todo } from './todo.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, })
    fullName: string;

    @Column({ type: 'varchar', length: 100, })
    email: string;

    @Column({ type: 'varchar', length: 255, })
    password: string;

    @Column({ type: 'int', default: 1 })
    tokenVersion: number;

    @OneToMany(() => Todo, (todo) => todo.createdBy, { eager: false })
    todos: Todo[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}