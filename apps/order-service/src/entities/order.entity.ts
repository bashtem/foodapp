import { CartItemDto } from "@foodapp/utils/src/dto";
import { DeliveryMethod, OrderStatus } from "@foodapp/utils/src/enums";
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
  userId!: string;

  @Column({ type: "uuid" })
  restaurantId!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  paymentId!: string;

  @Column({ type: "uuid", nullable: true })
  courierId!: string;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.CREATED })
  status!: OrderStatus;

  @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
  timeline!: Array<{ status: string; timestamp: Date }>;

  @Column({ type: "text" })
  deliveryAddress!: string;

  @Column({ type: "enum", enum: DeliveryMethod, default: DeliveryMethod.DELIVERY })
  deliveryMethod!: DeliveryMethod;

  @Column({ type: "jsonb", default: () => "'{}'::jsonb", nullable: true })
  metadata!: Record<string, any>;

  @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
  orderItems!: CartItemDto[];

  @Column({ type: "double precision", default: 0 })
  tip!: number;

  @Column({ type: "double precision", default: 0 })
  total!: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  txRef!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
