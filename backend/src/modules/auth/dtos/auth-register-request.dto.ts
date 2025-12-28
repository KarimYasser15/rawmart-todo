import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';
export class AuthRegisterRequestDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}