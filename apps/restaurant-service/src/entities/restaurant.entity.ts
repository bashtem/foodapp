import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  Index,
  DeleteDateColumn,
} from "typeorm";
import { MenuItem } from "./menu_item.entity";
import { CuisineType } from "@foodapp/utils/src/enums/cuisine.enum";

@Entity("restaurants")
export class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  @Index({ unique: true })
  name!: string;

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "double precision" })
  lat!: number;

  @Column({ type: "double precision" })
  lng!: number;

  @Column({ type: "uuid" })
  @Index()
  ownerId!: string;

  @Column({
    type: "enum",
    enum: CuisineType,
    array: true,
    default: [],
  })
  cuisines!: CuisineType[];

  @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
  hours!: string[];

  @Column({ type: "jsonb", nullable: true })
  deliveryPolygon?: string;

  @Column({ type: "varchar", length: 15 })
  phone!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  website?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  imageUrl?: string;

  @Column({ type: "boolean", default: false })
  isOpen!: boolean;

  @Column({ type: "boolean", default: false })
  isActivated!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deletedAt", nullable: true })
  deletedAt?: Date;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant)
  menuItems!: MenuItem[];
}
