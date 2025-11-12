import { Controller, Inject, Logger } from "@nestjs/common";
import { ClientGrpc, GrpcMethod, RpcException } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { firstValueFrom } from "rxjs";
import { UserService } from "@foodapp/utils/src/interfaces/user.interface";
import { ApiErrorCode } from "@foodapp/utils/src/response";
import * as bcrypt from "bcrypt";
import { status } from "@grpc/grpc-js";
import {
  AuthDto,
  AuthResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
  VerifyTokenDto,
  VerifyTokenResponseDto,
} from "@foodapp/utils/src/dto";
import { ServiceEnum, ServiceGrpcEnum } from "@foodapp/utils/src/enums";

@Controller()
export class AuthGrpcController {
  private readonly logger = new Logger(AuthGrpcController.name);
  private userService!: UserService;

  constructor(
    @Inject(ServiceGrpcEnum.USER_GRPC) private userClient: ClientGrpc,
    private authService: AuthService
  ) {}

  onModuleInit() {
    this.userService = this.userClient.getService<UserService>(ServiceEnum.USER_SERVICE);
  }

  @GrpcMethod(ServiceEnum.AUTH_SERVICE, "Login")
  async login(data: AuthDto): Promise<AuthResponseDto> {
    const { email, password } = data;

    this.logger.log(`Login request for email: ${email}`);
    try {
      const user = await firstValueFrom(this.userService.findByEmail({ email }));

      const ok = await bcrypt.compare(password, user.hashedPassword as string);

      if (!ok)
        throw new RpcException({
          code: status.UNAUTHENTICATED,
          message: ApiErrorCode.INVALID_CREDENTIALS,
        });

      const { accessToken, refreshToken, expiresIn } = await this.authService.generateToken(
        user.id,
        user.role,
        user.email
      );

      this.logger.log(`Generated token for user: ${user.id}, email: ${email}`);
      return {
        accessToken,
        refreshToken,
        expiresIn,
        tokenType: "Bearer",
      };
    } catch (error: any) {
      this.logger.error(`Login failed for email: ${email} - ${error.message}`);
      if (error.code === status.NOT_FOUND) {
        throw new RpcException({
          code: status.UNAUTHENTICATED,
          message: ApiErrorCode.INVALID_CREDENTIALS,
        });
      }
      throw error;
    }
  }

  @GrpcMethod(ServiceEnum.AUTH_SERVICE, "VerifyAuthToken")
  async verifyAuthToken(data: VerifyTokenDto): Promise<VerifyTokenResponseDto> {
    this.logger.log(`Verifying token: ${data.accessToken}`);

    try {
      const payload = await this.authService.verifyToken(data.accessToken);
      this.logger.log(`Token verified for user: ${payload.sub}`);

      return payload;
    } catch (error: any) {
      this.logger.error(`Token verification failed: ${error.message}`);
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: ApiErrorCode.INVALID_TOKEN,
      });
    }
  }

  @GrpcMethod(ServiceEnum.AUTH_SERVICE, "RefreshAccessToken")
  async refreshAccessToken(data: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    this.logger.log("Refreshing access token using refresh token.");
    try {
      const { email, sub, role } = await this.authService.verifyRefreshToken(data.refreshToken);
      const payload = await this.authService.generateToken(sub, role, email);

      this.logger.log("Access token refreshed successfully.");
      return {
        accessToken: payload.accessToken,
        tokenType: "Bearer",
        expiresIn: payload.expiresIn,
      };
    } catch (error: any) {
      this.logger.error(`Refresh token failed: ${error.message}`);
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: ApiErrorCode.INVALID_REFRESH_TOKEN,
      });
    }
  }

  @GrpcMethod(ServiceEnum.AUTH_SERVICE, "Logout")
  async logout(data: { userId: string }) {
    this.logger.log(`Logging out user: ${data.userId}`);
    // Implement logout logic if needed (e.g., token revocation)
    return { success: true };
  }
}
