import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';

import { IUser } from '../interfaces/user';
import { User } from '../utils/user.decorator';
import { OwnerGuard } from '../utils/owner.guard';
import { ProductService } from './product.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { ICreateProductDTO, UpdateProductDTO } from './product.dto';

import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');

@Controller('product')
export class ProductController {

    constructor(private productService: ProductService) { }

    @Get()
    async allProducts() {
        return await this.productService.allProducts();
    }

    @Get("category/:category")
    async productsByCategory(
        @Param('category') category: string
    ) {
        return { products: await this.productService.productsByCategory(category) };
    }

    @Get("search/:name")
    async search(
        @Param('name') name: string,
    ) {
        let options = {};

        if (name) {
            options = {
                $or: [
                    { name: new RegExp("^" + name, 'i') },
                ]
            }
        }

        const query = await this.productService.find(options);

        const limit = 9;
        const total = await this.productService.count(options);
        console.log(`TOtal ${total}`)

        return { products: query };
    }

    @Get('my')
    @UseGuards(JwtAuthGuard, OwnerGuard)
    async myProducts(
        @User() user: IUser
    ) {
        return await this.productService.findProductsByOwner(user.id);
    }

    @Get('owner/:id')
    async productsByOwner(
        @Param('id') id: string
    ) {
        return await this.productService.findProductsByOwner(id);
    }

    @Get(':id')
    async productDetails(
        @Param('id') id: string,
        @Query('userId') userId: string,
    ) {
        return await this.productService.productDetail(id, userId);
    }

    @Post()
    @UseGuards(JwtAuthGuard, OwnerGuard)
    async createProduct(
        @Body() productDTO: ICreateProductDTO,
        @User() user: IUser,
    ) {
        return await this.productService.createProduct(productDTO, user);
    }

    @Put('upload/:id')
    @UseGuards(JwtAuthGuard, OwnerGuard)
    @UseInterceptors(FilesInterceptor('images', 10, {
        storage:
            diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                    const extension: string = path.parse(file.originalname).ext;

                    return cb(null, `${filename}${extension}`)
                }
            })
    }))
    async uploadFile(
        @UploadedFiles() images: Array<Express.Multer.File>,
        @Param('id') id: string,
        @User() user: IUser,
    ) {
        await Promise.all(images.map(async (image) => {
            const imagePath = `http://localhost:3000/api/product/image/${image.filename}`;
            return await this.productService.uploadImages(id, { image: imagePath }, user.id);
        }));
    }

    @Get('image/:imageId')
    async serveImage(@Param('imageId') imageId, @Res() res): Promise<any> {
        res.sendFile(imageId, { root: 'uploads' });
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, OwnerGuard)
    async updateProduct(
        @Param('id') id: string,
        @Body() productDTO: UpdateProductDTO,
        @User() user: IUser
    ) {
        return await this.productService.updateProduct(id, productDTO, user.id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, OwnerGuard)
    async deleteProduct(
        @Param('id') id: string,
        @User() user: IUser
    ) {
        return await this.productService.deleteProduct(id, user.id);
    }
}