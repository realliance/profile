import {
  Request,
  Headers,
  Controller,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { authenticateAgainstMinecraft } from 'src/utils/minecraft';
import { User } from 'src/users/user.entity';

@Controller()
export class ConnectionController {
  constructor(private connectionService: ConnectionsService) {}

  @Post('connections/minecraft')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiHeader({
    name: 'MS_Authorization',
  })
  async addMinecraft(
    @Headers('MS_Authorization') msAccessToken,
    @Request() req,
  ): Promise<void> {
    const user = User.fromJwt(req.user);
    const id = await authenticateAgainstMinecraft(msAccessToken);
    await this.connectionService.saveForUser(user, { minecraft_uuid: id });
  }

  @Delete('connections/minecraft')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async removeMinecraft(@Request() req): Promise<void> {
    const user = User.fromJwt(req.user);
    await this.connectionService.saveForUser(user, {
      minecraft_uuid: null,
    });
  }
}
