import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(data: any) {
    const password_hash = await bcrypt.hash(data.password, 10);
    return this.repo.save(
      this.repo.create({
        email: data.email,
        password_hash,
        role: data.role || "customer",
      })
    );
  }

  get(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}
