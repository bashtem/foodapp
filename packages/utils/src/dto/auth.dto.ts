import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthDto {
  @ApiProperty({
    description: "User's email address",
    example: "user@example.com",
    type: String,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "User's password",
    example: "SecurePassword123!",
    type: String,
    minLength: 8,
  })
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
  @ApiProperty({
    description: "JWT access token to verify",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    type: String,
  })
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
  @ApiProperty({
    description: "JWT refresh token to get new access token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    type: String,
  })
  @IsString()
  refreshToken!: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
