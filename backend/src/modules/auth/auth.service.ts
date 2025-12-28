import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { MessageDto } from "../dtos/message.dto";
import { AuthRegisterRequestDto } from "./dtos/auth-register-request.dto";
import { User } from "../user/entity/user.entity";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
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

}