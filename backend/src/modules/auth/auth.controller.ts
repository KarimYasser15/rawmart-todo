import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiBody, ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { MessageDto } from '../dtos/message.dto';
import { AuthRegisterRequestDto } from './dtos/auth-register-request.dto';
import { AuthService } from './auth.service';
import { UserDataResponseDto } from './dtos/user-data-response.dto';
import { AuthLoginRequestDto } from './dtos/auth-login-request.dto';
import { CurrentUser } from '../../decorators/current-user';
import { AuthGuard } from './guards/auth.guard';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: MessageDto,
    })
    @ApiBody({ type: MessageDto })
    public async register(@Body() registerRequestDto: AuthRegisterRequestDto): Promise<MessageDto> {
        return this.authService.register(registerRequestDto);
    }
    @Post('/login')
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserDataResponseDto,
    })
    @ApiBody({ type: AuthLoginRequestDto })
    public async login(@Body() authLoginRequestDto: AuthLoginRequestDto): Promise<UserDataResponseDto> {
        return this.authService.login(authLoginRequestDto);
    }

    @Post('/logout')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiResponse({
        status: HttpStatus.OK,
        type: MessageDto,
    })
    @ApiBody({ type: AuthRegisterRequestDto })
    public async logout(@CurrentUser() userPayload: JwtPayload): Promise<MessageDto> {
        return this.authService.logout(userPayload.id);
    }


}