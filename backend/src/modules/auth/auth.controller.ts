import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiBody, ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { MessageDto } from '../dtos/message.dto';
import { AuthRegisterRequestDto } from './dtos/auth-register-request.dto';
import { AuthService } from './auth.service';

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

}