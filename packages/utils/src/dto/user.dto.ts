import { IsEmail, IsEnum, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../enums/role";

export class RegisterUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}

export interface UserResponseDto extends Omit<RegisterUserDto, "password"> {
  id: string;
  createdAt: Date;
}
