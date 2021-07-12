import { sign } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

import { IUser } from '../interfaces/user';
import { Payload } from '../interfaces/payload';
import { UserService } from '../user/user.service';
import { LoginDTO, RegisterDTO } from './auth.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UserService) { }

    async login(loginDTO: LoginDTO) {
        return await this.userService.findByLogin(loginDTO);
    }

    async register(registerDTO: RegisterDTO) {
        return await this.userService.create(registerDTO);
    }

    async signPayload(payload: Payload) {
        return sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
    }

    async validateUser(payload: Payload): Promise<IUser | undefined> {
        return this.userService.findByPayload(payload);
    }
}
