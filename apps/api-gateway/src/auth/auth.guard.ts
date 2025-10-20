import { AuthService } from "@foodapp/utils/src/interfaces";
import { ApiErrorCode } from "@foodapp/utils/src/response";
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { AUTH_GRPC, AUTH_SERVICE } from "@foodapp/utils/src/constants"

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private authService!: AuthService;

  constructor(@Inject(AUTH_GRPC) private readonly client: ClientGrpc) {
    this.authService = this.client.getService<AuthService>(AUTH_SERVICE);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token)
      throw new UnauthorizedException(ApiErrorCode.MISSING_AUTH_TOKEN);

    try {
      const data = await firstValueFrom(
        this.authService.verifyAuthToken({ accessToken: token })
      );
      request.user = data;
      this.logger.log(`Authenticated user: ${data.sub}`);

      return true;
    } catch (error: any) {
      this.logger.error(`AuthGuard error: ${error.message}`);
      throw new UnauthorizedException(ApiErrorCode.INVALID_TOKEN);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
