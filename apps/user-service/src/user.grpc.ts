import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { UserService } from "./user.service";
import { RegisterUserDto, UserResponseDto } from "@foodapp/utils/src/dto/user.dto";
import { status } from "@grpc/grpc-js";
import { ApiErrorCode } from "@foodapp/utils/src/response";
import { ServiceEnum } from "@foodapp/utils/src/enums";

@Controller()
export class UserGrpcController {
  private readonly logger = new Logger(UserGrpcController.name);

  constructor(private userService: UserService) {}

  @GrpcMethod(ServiceEnum.USER_SERVICE, "RegisterUser")
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

  @GrpcMethod(ServiceEnum.USER_SERVICE, "GetUser")
  get(id: string) {
    return this.userService.findById(id);
  }

  @GrpcMethod(ServiceEnum.USER_SERVICE, "FindByEmail")
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
    this.logger.log(`ResetPassword request for email: ${email}`);
    // Reset password logic here
  }

  changePassword(userId: string, newPassword: string) {
    this.logger.log(`ChangePassword request for user ID: ${userId}`);
    console.log(newPassword);
    // Change password logic here
  }
}
