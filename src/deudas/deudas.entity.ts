import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Deuda {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('float')
    amount: number;

    @Column()
    description: string;
}