import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { IUser } from '../interfaces/user';
import { IProduct } from '../interfaces/product';
import { ICreateProductDTO, UpdateProductDTO } from './product.dto';
import { Categories } from './product.categories';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class ProductService {

    constructor(
        @InjectModel('Product') private productModel: Model<IProduct>,
        @Inject(forwardRef(() => CartService)) private cartService: CartService
    ) { }

    async allProducts() {
        const all = await this.productModel.find().select('id name image price discountPercent ownerId category');
        const topPicks = await this.productModel.find().sort({ orderQuantity: -1 })
            .select('id name image price discountPercent ownerId').limit(5);

        const categories = Object.values(Categories);

        const groupByCategory = (records: any[], topPicks: any[]) => {
            return records.reduce((acc, rec) => {
                acc["topPicks"] = topPicks;
                const key = rec.category
                if (acc[key]) {
                    if (acc[key].length < 5)
                        acc[key].push(rec);
                } else {
                    acc[key] = [rec];
                }
                return acc;
            }, {});
        };

        return {
            products: groupByCategory(all, topPicks),
            categories: categories
        }
    }

    async topPicks() {
        return await this.productModel.find().sort({ orderQuantity: -1 })
            .select('id name image price discountPercent ownerId').limit(5);
    }

    async productsByCategory(category: string) {
        const prod = await this.productModel.find({ category: category })
            .select('id name image price discountPercent ownerId').limit(10);
        return prod;
    }

    async find(options) {
        return await this.productModel.find(options).sort({ name: 1 });
    }

    async count(options) {
        return await this.productModel.count(options).exec();
    }

    async searchProduct(name: string) {
        return await this.productModel.find({ name: { $regex: "^" + name } }).sort({ name: 1 }).select('id name image price discountPercent ownerId').limit(10);
    }

    async findProductsByOwner(userId: string): Promise<IProduct[] | undefined> {
        return await this.productModel.find({}, { ownerId: userId });
    }

    async productDetail(id: string, userId: string): Promise<IProduct | undefined> {
        const product = await this.productModel.findById(id);
        product.addedToCart = await this.cartService.getCartByProductId(id, userId) != null;
        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NO_CONTENT);
        }

        return product;
    }

    async createProduct(
        productDTO: ICreateProductDTO,
        user: IUser,
    ): Promise<IProduct | undefined> {
        const product = await this.productModel.create({
            ...productDTO,
            ownerId: user.id,
        });
        await product.save();
        return product;
    }

    async uploadImages(
        id: string,
        productDTO: UpdateProductDTO,
        userId: string
    ) {
        const product = await this.productModel.findById(id);

        if (userId != product.ownerId.toString()) {
            throw new UnauthorizedException('Unauthorized access');
        }

        await product.updateOne(
            { $push: productDTO }
        );
        return { message: "Image saved" };
    }

    async updateProduct(
        id: string,
        productDTO: UpdateProductDTO,
        userId: string
    ): Promise<IProduct | undefined> {
        const product = await this.productModel.findById(id);

        if (userId != product.ownerId.toString()) {
            throw new UnauthorizedException('Unauthorized access');
        }

        await product.updateOne(productDTO);
        return product;
    }

    async updateOrderedQuantity(
        id: string,
        productDTO: UpdateProductDTO,
        userId: string
    ): Promise<IProduct | undefined> {
        const product = await this.productModel.findById(id);
        await product.updateOne(productDTO);
        return product;
    }

    async deleteProduct(
        id: string,
        userId: string
    ): Promise<IProduct | undefined> {
        const product = await this.productModel.findById(id);
        if (userId != product.ownerId.toString()) {
            throw new UnauthorizedException('Unauthorized access');
        }

        await product.remove();
        return product;
    }
}
