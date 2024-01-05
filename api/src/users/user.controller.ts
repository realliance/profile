import {
  Controller,
  Request,
  Get,
  UseGuards,
  Param,
  Patch,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUser, User } from './user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiParamOptions,
} from '@nestjs/swagger';

const usernameParam: ApiParamOptions = {
  name: 'username',
  required: true,
  type: 'string',
  description: 'Username',
};

interface GetByUsernameParam {
  username: string;
}

@Controller()
export class UserController {
  constructor(private userService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getProfile(@Request() req): Promise<User> {
    return this.userService.findOneByJwt(req.user);
  }

  @Get('user/:username')
  @ApiParam(usernameParam)
  getOneUser(@Param() params: GetByUsernameParam): Promise<User> {
    return this.userService.findOneBy({ username: params.username });
  }

  @Patch('user/:username')
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({
    required: true,
    type: UpdateUser,
    description: 'Updated user parameters',
  })
  @ApiParam(usernameParam)
  @ApiBearerAuth()
  updateUser(
    @Request() req,
    @Param() params: GetByUsernameParam,
    @Body() updatedUser: UpdateUser,
  ): Promise<void> {
    const fromJwt = User.fromJwt(req.user);
    const isSameUser = fromJwt.username === params.username;
    const isAdmin = fromJwt.admin;

    if (isAdmin || isSameUser) {
      return this.userService.updateUser(
        { username: params.username },
        updatedUser,
      );
    }

    throw new Error('Not allowed to update this user');
  }
}
