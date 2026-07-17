import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ahorros {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  description?: string;

  @Column()
  type: string;

  @Column({ type: 'date', nullable: true })
  date?: Date;

  @Column()
  userId: number;
}
