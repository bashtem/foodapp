import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  orderId!: string;

  @Column({ type: "varchar", length: 50 })
  method!: string;

  @Column({ type: "varchar", length: 50, default: "SUCCEEDED" })
  status!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  reference!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "varchar", length: 10, default: "NGN" })
  currency!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
