import { forwardRef, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { ICart } from 'src/interfaces/cart';
import { IUser } from 'src/interfaces/user';
import { ProductService } from 'src/product/product.service';
import { ICreateCartDTO, UpdateCartDTO } from './cart.dto';

@Injectable()
export class CartService {

    constructor(
        @InjectModel('Cart') private cartModel: Model<ICart>,
        @Inject(forwardRef(() => ProductService)) private productService: ProductService
    ) { }

    async allCarts(userId: string) {
        return await this.cartModel.find({ buyerId: userId }).select('id name image price quantity category productId owner');
    }

    async addToCart(cartDTO: ICreateCartDTO, user: IUser) {
        const cart = await this.cartModel.find({ owner: user.id, productId: cartDTO.productId });

        if (cart.length > 0) {
            throw new HttpException('Product already added to cart', HttpStatus.BAD_REQUEST);
        }

        const cartData = await this.cartModel.create({
            ...cartDTO,
            ownerId: user.id,
        })

        await (await cartData.save()).execPopulate(async (err, data: ICart) => {
            if (err) {
                throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
            }

            const product = await this.productService.productDetail(data.productId, user.id);
            let quantity = product.orderQuantity + data.quantity;
            await (await this.productService.updateOrderedQuantity(data.productId, { orderQuantity: quantity }, user.id))
                .execPopulate((err, data) => {
                    if (!err) {
                        return cartData;
                    }
                })
        });
    }

    async getCartByProductId(productId: string, userId: string) {
        return await this.cartModel.findOne({ productId: productId, buyerId: userId });
    }

    async updateCart(id: string, cartDTO: UpdateCartDTO, userId: string) {
        const cart = await this.cartModel.findById(id);

        if (userId != cart.ownerId.toString()) {
            throw new UnauthorizedException('Unauthorized access');
        }

        await cart.updateOne(cartDTO);
        return cart;
    }

    async deleteCart(id: string, userId: string) {
        const cart = await this.cartModel.findById(id);

        if (userId != cart.ownerId.toString()) {
            throw new UnauthorizedException('Unauthorized access');
        }

        await cart.remove();
        return cart;
    }
}
