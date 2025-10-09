import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { LoginDto, VerifyDto } from "@foodapp/utils/src/dto";

@Controller()
export class AuthGrpcController {
  private readonly logger = new Logger(AuthGrpcController.name);

  constructor(private authService: AuthService) {}

  @GrpcMethod("AuthService", "Login")
  async login(data: LoginDto) {
    const { email, password } = data;

    this.logger.log(`Login request for email: ${email}`);
    return this.authService.login(email, password);
  }

  @GrpcMethod("AuthService", "Verify")
  verify(data: VerifyDto) {
    this.logger.log(`Verifying token: ${data.access_token}`);
    return this.authService.verifyToken(data.access_token);
  }
}
