import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  customer_id!: string;

  @Column({ type: "uuid" })
  restaurant_id!: string;

  @Column({ type: "varchar", length: 50, default: "CREATED" })
  status!: string;

  @Column("jsonb", { default: () => "'[]'" })
  items!: any[];

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  total!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
