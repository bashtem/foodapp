import { RegisterUserDto } from "@foodapp/utils/src/dto";
import { UserService } from "@foodapp/utils/src/interfaces";
import { ApiErrorCode, ApiSuccessCode, createResponse, StatusCode } from "@foodapp/utils/src/response";
import { Body, Controller, HttpException, HttpStatus, Inject, Logger, OnModuleInit, Post } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Controller("users")
export class UsersController implements OnModuleInit {
  private userService!: UserService;

  private readonly logger = new Logger(UsersController.name);
  constructor(@Inject("USER_GRPC") private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>("UserService");
  }

  @Post("register")
  async register(@Body() registerDto: RegisterUserDto) {
    try {
      this.logger.log(`Registering user with email: ${registerDto.email}`);
      const data = await firstValueFrom(this.userService.registerUser(registerDto));
      return createResponse({
        code: StatusCode.CREATED,
        message: ApiSuccessCode.REGISTER_SUCCESS,
        data,
      });
    } catch (error: any) {
      this.logger.error(`Register failed`, error);
      throw new HttpException(
        createResponse({
          code: StatusCode.BAD_REQUEST,
          message:
            error.response || error.message || ApiErrorCode.REGISTER_FAILED,
        }),
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
