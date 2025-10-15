import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { RegisterUserDto } from "@foodapp/utils/src/dto/";
import { UserRole } from "@foodapp/utils/src/enums";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    this.logger.log(`findByEmail: ${email} found: ${!!user}`);
    return user;
  }

  findById(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  findByPhone(phone: string) {
    return this.userRepo.findOne({ where: { phone } });
  }

  async create(userData: RegisterUserDto) {
    const { email, name, phone, password, role } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.email = email;
    user.name = name;
    user.phone = phone;
    user.hashedPassword = hashedPassword;
    user.role = role || UserRole.CUSTOMER;

    this.logger.log(`Creating user: ${email} with role: ${user.role}`);

    return this.userRepo.save(user);
  }

  delete(id: string) {
    return this.userRepo.delete(id);
  }
}
