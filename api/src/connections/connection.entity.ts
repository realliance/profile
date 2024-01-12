import { Column, Entity, PrimaryColumn } from 'typeorm';

export class MinecraftToken {
  token: string;
}

@Entity()
export class Connection {
  @PrimaryColumn()
  userId: string;

  @Column({ unique: true, nullable: true })
  minecraft_uuid?: string;
}
