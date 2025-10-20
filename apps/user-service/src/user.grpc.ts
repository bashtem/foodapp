import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { UserService } from "./user.service";
import {
  RegisterUserDto,
  UserResponseDto,
} from "@foodapp/utils/src/dto/user.dto";
import { status } from "@grpc/grpc-js";
import { ApiErrorCode } from "@foodapp/utils/src/response";
import { USER_SERVICE } from "@foodapp/utils/src/constants";

@Controller()
export class UserGrpcController {
  private readonly logger = new Logger(UserGrpcController.name);

  constructor(private userService: UserService) {}

  @GrpcMethod(USER_SERVICE, "RegisterUser")
  async registerUser(data: RegisterUserDto) {
    this.logger.log(`Register User request for email: ${data.email}`);

    const emailExist = await this.userService.findByEmail(data.email);
    if (emailExist) {
      this.logger.warn(`Email already in use: ${data.email}`);
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: ApiErrorCode.EMAIL_ALREADY_IN_USE,
      });
    }

    const phoneExist = await this.userService.findByPhone(data.phone);
    if (phoneExist) {
      this.logger.warn(`Phone number already in use: ${data.phone}`);
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: ApiErrorCode.PHONE_ALREADY_IN_USE,
      });
    }

    const user = await this.userService.create(data);

    const userResponse: UserResponseDto = user;

    this.logger.log(`User created with ID: ${userResponse.id}`);
    return userResponse;
  }

  @GrpcMethod(USER_SERVICE, "GetUser")
  get(id: string) {
    return this.userService.findById(id);
  }

  @GrpcMethod(USER_SERVICE, "FindByEmail")
  async findByEmail(data: { email: string }) {
    this.logger.log(`FindByEmail request for email: ${data.email}`);
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      this.logger.warn(`User with email ${data.email} not found`);
      throw new RpcException({
        code: status.NOT_FOUND,
        message: ApiErrorCode.USER_NOT_FOUND,
      });
    }
    return user;
  }

  resetPassword(email: string) {
    // Reset password logic here
  }

  changePassword(userId: string, newPassword: string) {
    // Change password logic here
  }
}
