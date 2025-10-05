import { LoginDto, VerifyDto } from "../dto";
import { Observable } from "rxjs";
import { RegisterDto } from "../dto/auth.dto";

export interface AuthSvc {
  login(body: LoginDto): Observable<{ accessToken: string }>;
  verify(
    body: VerifyDto
  ): Observable<{ userId: string; role: string; valid: boolean }>;
  register(body: RegisterDto): Observable<{ userId: string }>;
}
