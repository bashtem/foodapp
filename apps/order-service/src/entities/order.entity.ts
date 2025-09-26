import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() customer_id: string;
  @Column() restaurant_id: string;
  @Column({ default: 'CREATED' }) status: string;
  @Column('jsonb', { default: () => "'[]'" }) items: any[];
  @Column('decimal', { precision:10, scale:2, default:0 }) total: number;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
