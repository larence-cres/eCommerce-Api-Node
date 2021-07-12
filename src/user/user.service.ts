import { Model } from 'mongoose';
import * as Bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { IUser } from '../interfaces/user';
import { Payload } from '../interfaces/payload';
import { LoginDTO, RegisterDTO } from '../auth/auth.dto';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private userModel: Model<IUser>) { }

    async create(registerDTO: RegisterDTO) {
        const { username, email } = registerDTO;
        const userByUsername = await this.userModel.findOne({ username });
        const userByEmail = await this.userModel.findOne({ email });
        if (userByUsername) {
            throw new HttpException('Username already taken', HttpStatus.BAD_REQUEST);
        }
        if (userByEmail) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const createdUser = new this.userModel(registerDTO);
        await createdUser.save();
        return this.removePassword(createdUser);
    }

    async findByLogin(loginDTO: LoginDTO) {
        const { username, password } = loginDTO;
        const user = await this.userModel.findOne({ username }).select('username password email seller address created');
        if (!user) {
            throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
        }

        if (await Bcrypt.compare(password, user.password)) {
            return this.removePassword(user);
        } else {
            throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
        }
    }

    async findByPayload(payload: Payload): Promise<IUser | undefined> {
        const { username } = payload;
        return await this.userModel.findOne({ username });
    }

    removePassword(user: IUser) {
        const removed = user.toObject();
        delete removed['password'];
        return removed;
    }

}
