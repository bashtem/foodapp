import { KYCStatus } from "@foodapp/utils/src/enums/kyc";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class KYC extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "enum", enum: KYCStatus, default: KYCStatus.PENDING })
  status!: KYCStatus;

  @Column({ type: "text", nullable: true, default: null })
  rejectionReason!: string | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  submittedAt!: Date;

  @Column({ type: "timestamp", nullable: true, default: null })
  reviewedAt!: Date | null;

  @Column({ type: "varchar", length: 255, nullable: true, default: null })
  reviewedBy!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.kyc)
  @JoinColumn()
  user!: User;
}
