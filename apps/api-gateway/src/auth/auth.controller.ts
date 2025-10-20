import {
  HttpCode,
  HttpException,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { Body, Controller, Inject, Post, HttpStatus } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { AuthService } from "@foodapp/utils/src/interfaces";
import { AuthDto, RefreshTokenDto, VerifyTokenDto } from "@foodapp/utils/src/dto";
import {
  ApiSuccessCode,
  createResponse,
  grpcToHttpStatusMap,
} from "@foodapp/utils/src/response";
import { AUTH_GRPC } from "@foodapp/utils/src/constants";

@Controller("auth")
export class AuthController implements OnModuleInit {
  private authService!: AuthService;

  private readonly logger = new Logger(AuthController.name);
  constructor(@Inject(AUTH_GRPC) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>("AuthService");
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() authDto: AuthDto) {
    this.logger.log(`Login attempt for email: ${authDto.email}`);
    try {
      const data = await firstValueFrom(this.authService.login(authDto));
      this.logger.log(`Login success for email: ${authDto.email}`);

      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.LOGIN_SUCCESS,
        data,
      });
    } catch (error: any) {
      this.logger.error(
        `Login failed for email: ${authDto.email}: ${error.message}`
      );
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("verify")
  async verify(@Body() authTokenDto: VerifyTokenDto) {
    try {
      const data = await firstValueFrom(this.authService.verifyAuthToken(authTokenDto));
      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.VERIFY_SUCCESS,
        data,
      });
    } catch (error: any) {
      this.logger.error(`Verify failed : ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const data = await firstValueFrom(this.authService.refreshAccessToken(refreshTokenDto));
      return createResponse({
        statusCode: HttpStatus.OK,
        message: ApiSuccessCode.REFRESH_SUCCESS,
        data,
      });
    } catch (error: any) {
      this.logger.error(`Refresh failed: ${error.message}`);
      throw new HttpException(error.details, grpcToHttpStatusMap[error.code]);
    }
  }
}
