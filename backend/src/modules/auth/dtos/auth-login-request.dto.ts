import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';
export class AuthLoginRequestDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}