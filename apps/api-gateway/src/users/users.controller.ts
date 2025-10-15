import { RegisterUserDto } from "@foodapp/utils/src/dto";
import { UserService } from "@foodapp/utils/src/interfaces";
import {
  ApiSuccessCode,
  createResponse,
  grpcToHttpStatusMap,
} from "@foodapp/utils/src/response";
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  OnModuleInit,
  Post,
} from "@nestjs/common";
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
      const data = await firstValueFrom(
        this.userService.registerUser(registerDto)
      );
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
}
