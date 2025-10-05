import { Logger, OnModuleInit } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import {
  Body,
  Controller,
  Inject,
  Post,
  HttpCode,
  HttpException,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { AuthSvc } from "@foodapp/utils/src/interfaces";
import { LoginDto, RegisterDto, VerifyDto } from "@foodapp/utils/src/dto/auth.dto";
import {
  ApiErrorCode,
  ApiSuccessCode,
  createResponse,
  StatusCode,
} from "@foodapp/utils/src/response";
import { Request } from "express";

@Controller("auth")
export class AuthController implements OnModuleInit {
  private authService!: AuthSvc;

  private readonly logger = new Logger(AuthController.name);
  constructor(@Inject("AUTH_GRPC") private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthSvc>("AuthService");
  }

  @Post("login")
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);
    try {
      const data = await firstValueFrom(this.authService.login(loginDto));
      this.logger.log(`Login success for email: ${loginDto.email}`);
      this.logger.log("environment", process.env.NODE_ENV);
      return createResponse({
        code: StatusCode.OK,
        message: ApiSuccessCode.LOGIN_SUCCESS,
        data,
      });
    } catch (error: any) {
      this.logger.error(`Login failed for email: ${loginDto.email}`, error);
      throw new HttpException(
        createResponse({
          code: StatusCode.UNAUTHORIZED,
          message: error.response || error.message || ApiErrorCode.LOGIN_FAILED,
        }),
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    try {
      const data = await firstValueFrom(this.authService.register(registerDto));
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
          message: error.response || error.message || ApiErrorCode.REGISTER_FAILED,
        }),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post("verify")
  async verify(@Body() verifyDto: VerifyDto) {
    try {
      const data = await firstValueFrom(this.authService.verify(verifyDto));
      return createResponse({
        code: StatusCode.OK,
        message: ApiSuccessCode.VERIFY_SUCCESS,
        data,
      });
    } catch (error: any) {
      this.logger.error(`Verify failed`, error);
      throw new HttpException(
        createResponse({
          code: StatusCode.UNAUTHORIZED,
          message:
            error.response || error.message || ApiErrorCode.VERIFY_FAILED,
        }),
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
