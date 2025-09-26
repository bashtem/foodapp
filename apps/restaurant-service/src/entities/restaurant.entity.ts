import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ default: 'open' }) status: string;
}
