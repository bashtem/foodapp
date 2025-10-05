import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserSvc } from "@foodapp/utils/src/interfaces";

@Injectable()
export class AuthService implements OnModuleInit {
  private userSvc!: UserSvc;

  constructor(
    @Inject("USER_GRPC") private client: ClientGrpc,
    private jwt: JwtService
  ) {}

  onModuleInit() {
    this.userSvc = this.client.getService<UserSvc>("UserService");
  }

  async login(email: string, password: string) {
    // const user = await firstValueFrom(
    //   this.userSvc.FindByEmail({ email }).pipe(timeout(4000))
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

  verify(token: string) {
    try {
      const p = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET || "devsecret",
      });
      return { valid: true, userId: p.sub, role: p.role };
    } catch {
      return { valid: false, userId: "", role: "" };
    }
  }
}
