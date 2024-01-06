import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from './connection.entity';
import { ConnectionsService } from './connections.service';
import { ConnectionController } from './connection.controller';
import { Module } from '@nestjs/common';

@Module({
  // forFeature is what triggers the entity to be loaded into the database management system as a persistant object type
  imports: [TypeOrmModule.forFeature([Connection])],
  providers: [ConnectionsService],
  controllers: [ConnectionController],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
