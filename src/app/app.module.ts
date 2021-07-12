import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { LoggingInterceptor } from '../utils/logging.interceptor';
import { HttpExceptionFilter } from '../utils/http-exception.filter';
import { CartModule } from 'src/cart/cart.module';
import { UploadModule } from 'src/upload/upload.module';

const options = {
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_CONNECTION, options),
    UserModule,
    AuthModule,
    ProductModule,
    CartModule,
    UploadModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    }
  ],
})
export class AppModule { }
