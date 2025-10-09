import { Injectable, Inject, OnModuleInit, Logger } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "@foodapp/utils/src/interfaces";

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private userService!: UserService;

  constructor(
    @Inject("USER_GRPC") private client: ClientGrpc,
    private jwt: JwtService
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>("UserService");
  }

  async login(email: string, password: string) {
    // const user = await firstValueFrom(
    //   this.userService.FindByEmail({ email }).pipe(timeout(4000))
    // );
    // if (!user) throw new Error("Invalid credentials");
    // const ok = await bcrypt.compare(password, user.password_hash);
    // if (!ok) throw new Error("Invalid credentials");
    // const token = this.jwt.sign({
    //   sub: user.id,
    //   role: user.role,
    //   email: user.email,
    // });
    const response = { accessToken: `${email}` };
    return response;
  }

  generateToken(userId: string, role: string, email: string) {
    return this.jwt.sign(
      {
        sub: userId,
        role,
        email,
      },
      {
        secret: process.env.JWT_SECRET || "devsecret",
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );
  }

  verifyToken(token: string) {
    try {
      const p = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET || "devsecret",
      });
      return { valid: true, userId: p.sub, role: p.role };
    } catch {
      return { valid: false, userId: "", role: "" };
    }
  }

  refreshToken(token: string) {
    try {
      const p = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET || "devsecret",
        ignoreExpiration: true,
      });
      const newToken = this.generateToken(p.sub, p.role, p.email);
      return { accessToken: newToken };
    } catch {
      throw new Error("Invalid token");
    }
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
