import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { UserSchema } from '../models/user.schema';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: 'User',
          schema: UserSchema
        }
      ]
    )
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
