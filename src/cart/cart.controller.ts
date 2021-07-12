import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';

import { IUser } from '../interfaces/user';
import { CartService } from './cart.service';
import { User } from '../utils/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { ICreateCartDTO, UpdateCartDTO } from './cart.dto';

@Controller('cart')
export class CartController {

    constructor(private cartService: CartService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async allCarts(@User() user: IUser) {
        return await this.cartService.allCarts(user.id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async addToCart(
        @Body() cartDTO: ICreateCartDTO,
        @User() user: IUser,
    ) {
        return await this.cartService.addToCart(cartDTO, user);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateCart(
        @Param('id') id: string,
        @Body() cartDTO: UpdateCartDTO,
        @User() user: IUser
    ) {
        return await this.cartService.updateCart(id, cartDTO, user.id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteCart(
        @Param('id') id: string,
        @User() user: IUser
    ) {
        return await this.cartService.deleteCart(id, user.id);
    }
}
