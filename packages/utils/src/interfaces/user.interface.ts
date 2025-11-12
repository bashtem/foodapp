import { Observable } from "rxjs/internal/Observable";
import { RegisterUserDto, UserResponseDto, VerifyTokenResponseDto } from "../dto";
import { Request as ExpressRequest } from "express";

export interface UserService {
  findByEmail({ email }: { email: string }): Observable<UserResponseDto>;
  findById(req: UserRequest): Observable<UserResponseDto>;
  registerUser(req: RegisterUserDto): Observable<UserResponseDto>;
}

export interface UserRequest extends ExpressRequest {
  user: VerifyTokenResponseDto;
}
