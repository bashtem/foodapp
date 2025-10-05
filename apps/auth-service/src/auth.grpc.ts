import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { LoginDto, VerifyDto } from "@foodapp/utils/src/dto";

@Controller()
export class AuthGrpcController {
  private readonly logger = new Logger(AuthGrpcController.name);
  constructor(private svc: AuthService) {}

  @GrpcMethod("AuthService", "Login")
  async login(data: LoginDto) {
    let res = await this.svc.login(data.email, data.password);
    return res;
  }

  @GrpcMethod("AuthService", "Verify")
  verify(data: VerifyDto) {
    return this.svc.verify(data.access_token);
  }
}
