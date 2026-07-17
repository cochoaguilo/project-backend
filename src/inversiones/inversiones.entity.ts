import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Inversiones {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float')
  hold: number;

  @Column()
  platform: string;

  @Column()
  symbol: string;

  @Column()
  purchaseDate: Date;

  @Column()
  userId: number;
}
