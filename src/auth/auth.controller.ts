import { Body, Controller, Post } from '@nestjs/common';

import { LoginDTO, RegisterDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Payload } from '../interfaces/payload';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('login')
    async login(
        @Body() loginDto: LoginDTO,
    ) {
        const user = await this.authService.login(loginDto);
        const payload: Payload = {
            username: user.username,
            seller: user.seller,
        }

        const token = await this.authService.signPayload(payload);
        return { user, token };
    }

    @Post('register')
    async register(
        @Body() registerDTO: RegisterDTO
    ) {
        const user = await this.authService.register(registerDTO);
        const payload: Payload = {
            username: user.username,
            seller: user.seller,
        }

        const token = await this.authService.signPayload(payload);
        return { user, token };
    }

}
