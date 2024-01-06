import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { GroupsService } from './group.service';
import { GroupController } from './group.controller';
import { JwtStrategy } from 'src/users/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ConnectionsModule } from 'src/connections/connections.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    ConnectionsModule,
  ],
  providers: [GroupsService, UsersService, JwtStrategy],
  controllers: [GroupController],
  exports: [GroupsService],
})
export class GroupsModule {}
