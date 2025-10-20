import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { MenuItem } from "./menu_item.entity";

@Entity("restaurants")
export class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ type: "text", nullable: true })
  address!: string | null;

  @Column({ type: "double precision", precision: 10, scale: 6 })
  lat!: number;

  @Column({ type: "double precision", precision: 10, scale: 6 })
  lng!: number;

  @Column()
  ownerId!: string;

  @Column({ type: "text", array: true, default: () => "'{}'" })
  cuisines!: string[];

  @Column({ type: "jsonb", default: () => "'[]'" })
  hours!: string[];

  @Column({ type: "jsonb", nullable: true })
  deliveryPolygon!: string;

  @Column()
  phoneNumber!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  website!: string;

  @Column({ nullable: true })
  imageUrl!: string;

  @Column({ default: true })
  isOpen!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant)
  menuItems!: MenuItem[];
}
