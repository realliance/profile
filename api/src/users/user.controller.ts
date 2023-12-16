import { Controller, Request, Get, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller()
export class UserController {
  constructor(private userService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req): Promise<User> {
    return this.userService.findOneByJwt(req.user);
  }

  @Get('user/:username')
  getOneUser(@Param() params: any): Promise<User> {
    return this.userService.findOneBy({ username: params.username });
  }
}
