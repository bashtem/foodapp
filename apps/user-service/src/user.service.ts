import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { RegisterUserDto } from "@foodapp/utils/src/dto/";
import { UserRole } from "@foodapp/utils/src/enums/role";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  findByPhone(phone: string) {
    return this.userRepo.findOne({ where: { phone } });
  }

  async registerUser(userData: RegisterUserDto) {
    const { email, name, phone, password, role } = userData;

    const emailExist = await this.findByEmail(email);
    if (emailExist) {
      throw new HttpException("Email already in use", HttpStatus.BAD_REQUEST);
    }

    const phoneExist = await this.findByPhone(phone);
    if (phoneExist) {
      throw new HttpException("Phone number already in use", HttpStatus.BAD_REQUEST);
    }

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
