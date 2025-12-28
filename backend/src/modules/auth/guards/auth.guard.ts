import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from '../../user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest<Request>();
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException("Missing Token");
        }

        const token = this.extractToken(authHeader);

        if (!token) {
            throw new UnauthorizedException("Invalid Token Format");
        }

        try {
            const userPayload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            const user = await this.userRepository.findOne({ where: { id: userPayload.id } });

            if (!user) {
                throw new UnauthorizedException("Access Denied");
            }
            if (userPayload.tokenVersion !== user.tokenVersion) {
                throw new UnauthorizedException("Access Denied");
            }

            req['user'] = userPayload;
            return true;
        } catch (error) {
            throw new UnauthorizedException("Access Denied");
        }
    }

    private extractToken(authHeader: string): string | null {
        const bearerPrefix = 'Bearer';
        const [type, token] = authHeader.trim().split(' ');
        return type === bearerPrefix && token ? token : null;
    }
}
