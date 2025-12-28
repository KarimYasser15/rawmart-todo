import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { MessageDto } from "../dtos/message.dto";
import { AuthRegisterRequestDto } from "./dtos/auth-register-request.dto";
import { User } from "../user/entity/user.entity";
import { AuthLoginRequestDto } from "./dtos/auth-login-request.dto";
import { UserDataResponseDto } from "./dtos/user-data-response.dto";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }
    public async register(registerRequestDto: AuthRegisterRequestDto): Promise<MessageDto> {
        const { email, fullName, password } = registerRequestDto;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException("User Already Exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ ...registerRequestDto, password: hashedPassword });
        await this.userRepository.save(user);
        return { message: "User Registered Successfully" };
    }
    public async login(loginRequestDto: AuthLoginRequestDto): Promise<UserDataResponseDto> {
        const { email, password } = loginRequestDto;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (!existingUser) {
            throw new BadRequestException("User Doesn't Exist");
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            throw new BadRequestException("Email or Password is incorrect");
        }
        const tokenPayload = { email: existingUser.email, id: existingUser.id, tokenVersion: existingUser.tokenVersion };
        const token = await this.generateAccessToken(tokenPayload);
        return UserDataResponseDto.userDateResponse(token, existingUser);
    }

    public async logout(userId: number): Promise<MessageDto> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException("User Doen't Exist");
        }
        user.tokenVersion = user.tokenVersion + 1;
        await this.userRepository.save(user);
        return { message: "Log Out Success" };

    }

    private generateAccessToken(payload: { email: string; id: number; }): string {
        const accessToken = this.jwtService.sign(payload);
        return accessToken;
    }
}