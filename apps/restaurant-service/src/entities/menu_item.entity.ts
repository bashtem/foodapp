import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() restaurant_id: string;
  @Column() name: string;
  @Column('decimal', { precision:10, scale:2 }) price: number;
  @Column({ default: true }) is_available: boolean;
}
