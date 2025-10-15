import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  // user: {
  //   id: string;
  //   email: string;
  //   name: string;
  //   role: string;
  // };
}

export class VerifyTokenDto {
  @IsString()
  accessToken!: string;
}
export interface VerifyTokenResponseDto {
  valid: boolean;
  sub: string;
  role: string;
  email: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
