import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Deudas {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('float')
    amount: number;

    @Column()
    description: string;

    @Column()
    userId: number;

   /*  @Column()
    date: Date;
     */
}