import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column({ type: "varchar", default: "customer" })
  role: string;
}
