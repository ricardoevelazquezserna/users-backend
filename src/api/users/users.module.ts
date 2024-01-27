import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas';
import { NOTIFICATION_SERVICE_OPTIONS } from 'src/shared/constants';

const SCHEMAS = [{ name: User.name, schema: UserSchema }];

@Module({
  imports: [
    MongooseModule.forFeature(SCHEMAS),
    ClientsModule.register(NOTIFICATION_SERVICE_OPTIONS),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
