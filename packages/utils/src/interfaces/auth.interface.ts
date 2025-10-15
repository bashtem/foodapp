import { Observable } from "rxjs";
import {
  RefreshTokenDto,
  RefreshTokenResponseDto,
  VerifyTokenDto,
  VerifyTokenResponseDto,
  AuthDto,
  AuthResponseDto,
} from "../dto";

export interface AuthService {
  login(body: AuthDto): Observable<AuthResponseDto>;
  verifyAuthToken(body: VerifyTokenDto): Observable<VerifyTokenResponseDto>;
  refreshAccessToken(
    body: RefreshTokenDto
  ): Observable<RefreshTokenResponseDto>;
}
