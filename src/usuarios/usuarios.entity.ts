import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Usuarios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  mail: string;

  @Column()
  password: string;
}