export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyDto {
  access_token: string;
}   

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}