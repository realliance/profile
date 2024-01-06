import { Request, Headers, Controller, Post, UseGuards } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { authenticateAgainstMinecraft } from 'src/utils/minecraft';

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
    return await authenticateAgainstMinecraft(msAccessToken);
  }
}
