import { Observable } from "rxjs/internal/Observable";
import { RegisterUserDto, UserResponseDto } from "../dto";

export interface UserService {
  findByEmail({ email }: { email: string }): Observable<UserResponseDto>;
  findById(req: any): Observable<UserResponseDto>;
  registerUser(req: RegisterUserDto): Observable<UserResponseDto>;
}