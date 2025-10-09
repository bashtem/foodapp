import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { UserService } from "./user.service";
import {
  RegisterUserDto,
  UserResponseDto,
} from "@foodapp/utils/src/dto/user.dto";

@Controller()
export class UserGrpcController {
  private readonly logger = new Logger(UserGrpcController.name);

  constructor(private userService: UserService) {}

  @GrpcMethod("UserService", "RegisterUser")
  async registerUser(data: RegisterUserDto) {
    this.logger.log(`Register User request for email: ${data.email}`);

    const user = await this.userService.registerUser(data);
    const userResponse: UserResponseDto = user;

    this.logger.log(`User created with ID: ${userResponse.id}`);
    return userResponse;
  }

  @GrpcMethod("UserService", "GetUser")
  get(id: string) {
    return this.userService.findById(id);
  }

  @GrpcMethod("UserService", "FindByEmail")
  find(email: string) {
    return this.userService.findByEmail(email);
  }

  resetPassword(email: string) {
    // Reset password logic here
  }

  changePassword(userId: string, newPassword: string) {
    // Change password logic here
  }
}
