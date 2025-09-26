import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() order_id: string;
  @Column({ default: 'SUCCEEDED' }) status: string;
  @Column({ unique: true }) reference: string;
  @Column('decimal', { precision:10, scale:2 }) amount: number;
  @Column({ default: 'NGN' }) currency: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
