import { Injectable, Inject, Logger } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { VerifyTokenResponseDto } from "@foodapp/utils/src/dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject("USER_GRPC") private client: ClientGrpc,
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async generateToken(userId: string, role: string, email: string) {
    const payload = { sub: userId, role, email, valid: true };
    const expiresIn = parseInt(
      this.configService.get<string>("JWT_EXPIRATION") as string
    );

    this.logger.log(`Generating token for user: ${userId}`);

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: parseInt(
        this.configService.get<string>("JWT_REFRESH_EXPIRATION") as string
      ),
    });

    return { accessToken, refreshToken, expiresIn };
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync<VerifyTokenResponseDto>(token);
  }

  async verifyRefreshToken(
    refreshToken: string
  ): Promise<VerifyTokenResponseDto> {
    return this.jwtService.verifyAsync<VerifyTokenResponseDto>(refreshToken, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
    });
  }

  enableMFA(userId: string, method: string) {
    // Enable MFA logic here
    // Activates a secondary authentication method for a user (e.g., TOTP, SMS).
  }

  disableMFA(userId: string) {
    // Disable MFA logic here
  }

  verifyMFA(userId: string, code: string) {
    // Verify MFA logic here
  }

  logout(userId: string) {
    // Logout logic here
    // Invalidates the user's current session or tokens.
  }
}
