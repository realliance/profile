import {
  Request,
  Controller,
  Post,
  UseGuards,
  Delete,
  Body,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { authenticateAgainstMinecraft } from 'src/utils/minecraft';
import { User } from 'src/users/user.entity';
import { Token } from './connection.entity';
import { getDiscordId } from 'src/utils/discord';

@Controller()
export class ConnectionController {
  constructor(private connectionService: ConnectionsService) {}

  @Post('connections/minecraft')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({
    required: true,
    type: Token,
    description: 'payload containing the token',
  })
  async addMinecraft(
    @Body() tokenPayload: Token,
    @Request() req,
  ): Promise<void> {
    const user = User.fromJwt(req.user);
    const id = await authenticateAgainstMinecraft(tokenPayload.token);
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


  @Post('connections/discord')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({
    required: true,
    type: Token,
    description: 'payload containing the token',
  })
  async addDiscord(
    @Body() tokenPayload: Token,
    @Request() req,
  ): Promise<void> {
    const user = User.fromJwt(req.user);
    const id = await getDiscordId(tokenPayload.token);
    await this.connectionService.saveForUser(user, { discordId: id });
  }

  @Delete('connections/discord')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async removeDiscord(@Request() req): Promise<void> {
    const user = User.fromJwt(req.user);
    await this.connectionService.saveForUser(user, {
      discordId: null,
    });
  }
}
