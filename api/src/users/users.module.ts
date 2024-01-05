import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './user.controller';

@Module({
  // forFeature is what triggers the entity to be loaded into the database management system as a persistant object type
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [UsersService, JwtStrategy],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
