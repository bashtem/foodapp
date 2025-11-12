import { RegisterUserDto } from "@foodapp/utils/src/dto";
import { UserService } from "@foodapp/utils/src/interfaces";
import {
  ApiErrorCode,
  ApiSuccessCode,
  createResponse,
  grpcToHttpStatusMap,
} from "@foodapp/utils/src/response";
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  OnModuleInit,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { AuthGuard } from "../auth/auth.guard";
import { ServiceEnum, ServiceGrpcEnum } from "@foodapp/utils/src/enums";

@Controller("users")
export class UsersController implements OnModuleInit {
  private userService!: UserService;

  private readonly logger = new Logger(UsersController.name);
  constructor(@Inject(ServiceGrpcEnum.USER_GRPC) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>(ServiceEnum.USER_SERVICE);
  }

  @Post("register")
  async register(@Body() registerDto: RegisterUserDto) {
    try {
      this.logger.log(`Registering user with email: ${registerDto.email}`);

      const data = await firstValueFrom(this.userService.registerUser(registerDto));
      delete data.hashedPassword; // Remove sensitive info

      this.logger.log(`User registered with ID: ${data.id}`);

      return createResponse({
        statusCode: HttpStatus.CREATED,
        message: ApiSuccessCode.REGISTER_SUCCESS,
        data,
      });
    } catch (error: any) {
      this.logger.error(
        `User Registration failed for email: ${registerDto.email} : ${error.message}`
      );
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @Get("me")
  @UseGuards(AuthGuard)
  async getMe(@Req() req: any) {
    const user = req.user;
    if (!user) {
      throw new HttpException(ApiErrorCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return createResponse({
      statusCode: HttpStatus.OK,
      message: ApiSuccessCode.GET_USER_SUCCESS,
      data: user,
    });
  }
}
