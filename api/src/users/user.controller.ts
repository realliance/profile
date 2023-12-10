import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class UserController {
  constructor() {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(): string {
    return 'OK';
  }
}
