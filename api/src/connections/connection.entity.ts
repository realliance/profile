import { Column, Entity, PrimaryColumn } from 'typeorm';

export class Token {
  token: string;
}

@Entity()
export class Connection {
  @PrimaryColumn()
  userId: string;

  @Column({ unique: true, nullable: true })
  minecraft_uuid?: string;

  @Column({ unique: true, nullable: true })
  discordId?: string;
}
