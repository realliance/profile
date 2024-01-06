import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Connection {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true, nullable: true })
  minecraft_uuid?: string;
}
