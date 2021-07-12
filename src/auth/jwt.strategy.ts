import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";

import { AuthService } from "./auth.service";
import { Payload } from "../interfaces/payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET_KEY
        });
    }

    async validate(payload: Payload, done: VerifiedCallback) {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            return done(new UnauthorizedException('Unauthorized access'), false);
        }
        return done(null, user, payload.iat);
    }
}