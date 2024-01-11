import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Connection } from './connection.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connection)
    private connectionsRepository: Repository<Connection>,
  ) {}

  async saveForUser(
    user: User,
    connection: Omit<Connection, 'userId'>,
  ): Promise<Connection> {
    return await this.connectionsRepository.save({
      ...connection,
      userId: user.id,
    });
  }
}
