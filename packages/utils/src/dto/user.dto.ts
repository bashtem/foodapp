import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../enums/role.enum";

export class RegisterUserDto {
  @ApiProperty({
    description: "User's email address",
    example: "user@example.com",
    type: String,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "User's full name",
    example: "John Doe",
    type: String,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: "User's phone number",
    example: "+1234567890",
    type: String,
  })
  @IsString()
  phone!: string;

  @ApiProperty({
    description:
      "User's password (must contain uppercase, lowercase, number, and special character)",
    example: "SecurePassword123!",
    type: String,
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  password!: string;

  @ApiProperty({
    description: "User's role in the system",
    example: UserRole.CUSTOMER,
    enum: UserRole,
    type: String,
  })
  @IsEnum(UserRole)
  role!: UserRole;
}

export interface UserResponseDto extends Omit<RegisterUserDto, "password"> {
  id: string;
  createdAt: Date;
  hashedPassword?: string; // For internal use only, should not be exposed in APIs
}
