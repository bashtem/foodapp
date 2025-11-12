import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column({ type: "uuid" }) order_id!: string;
  @Column({ type: "varchar", length: 50, default: "SUCCEEDED" }) status!: string;
  @Column({ type: "varchar", length: 255, unique: true }) reference!: string;
  @Column("decimal", { precision: 10, scale: 2 }) amount!: number;
  @Column({ type: "varchar", length: 10, default: "NGN" }) currency!: string;
  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}
