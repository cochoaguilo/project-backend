import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ahorros {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  description?: string;

  @Column()
  type: string;

  @Column({ type: 'date' })
  date?: Date;
}
