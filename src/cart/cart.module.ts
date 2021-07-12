import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from 'src/product/product.module';

import { CartSchema } from '../models/cart.schema';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: 'Cart',
          schema: CartSchema
        }
      ]
    ),
    forwardRef(() => ProductModule)
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService]
})
export class CartModule { }
