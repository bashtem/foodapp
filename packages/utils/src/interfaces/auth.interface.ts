import {  LoginDto, VerifyDto } from "../dto";
import { Observable } from "rxjs";

export interface AuthService {
  login(body: LoginDto): Observable<{ accessToken: string }>;
  verify(
    body: VerifyDto
  ): Observable<{ userId: string; role: string; valid: boolean }>;
}
