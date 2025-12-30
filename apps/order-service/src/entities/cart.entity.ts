import { CartItemDto } from "@foodapp/utils/src/dto";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from "typeorm";

@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  @Index()
  userId!: string;

  @Column({ type: "uuid" })
  restaurantId!: string;

  @Column({ type: "jsonb", default: () => "'[]'::jsonb", nullable: false })
  items!: CartItemDto[];

  @Column({ type: "double precision", default: 0 })
  totalPrice!: number;

  @Column({ type: "boolean", default: false })
  isCheckedOut!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
