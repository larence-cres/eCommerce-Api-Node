import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class OwnerGuard implements CanActivate {

    constructor() { }

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user.seller) {
            return true;
        }

        throw new UnauthorizedException(`Unauthorized access`);
    }

}