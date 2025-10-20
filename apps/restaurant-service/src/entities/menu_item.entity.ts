import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BaseEntity,
} from "typeorm";
import { Restaurant } from "./restaurant.entity";

@Entity("menu_items")
export class MenuItem extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  @Index()
  restaurantId!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column({ default: true })
  isAvailable!: boolean;

  @Column({ type: "text", nullable: true })
  category?: string | null;

  @Column({ type: "text", nullable: true })
  imageUrl?: string | null;

  @Column({ type: "int", default: 0 })
  preparationTime!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menuItems, {
    onDelete: "CASCADE",
  })
  restaurant!: Restaurant;
}
