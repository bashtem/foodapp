import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  BaseEntity,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "@foodapp/utils/src/enums";
import { KYC } from "./kyc.entity";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 15 })
  phone!: string;

  @Column({ type: "varchar", length: 255 })
  hashedPassword!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  address!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => KYC, (kyc) => kyc.user)
  kyc!: KYC;
}
