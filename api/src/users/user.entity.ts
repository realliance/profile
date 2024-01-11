import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ReallianceIdJwt } from './jwt';
import { Group } from '../groups/group.entity';
import { Connection } from 'src/connections/connection.entity';

export class UpdateUser {
  description?: string;
  pronouns?: string;
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  @IsNotEmpty()
  displayName: string;

  @Column({ unique: true })
  @IsEmail()
  username: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  pronouns?: string;

  @Column()
  @IsNotEmpty()
  admin: boolean;

  @ManyToMany(() => Group, (group) => group.users)
  @JoinTable()
  groups: Group[];

  @OneToOne(() => Connection)
  @JoinColumn({ name: 'id' })
  connections?: Connection;

  static fromJwt(jwt: ReallianceIdJwt): User {
    return {
      id: jwt.sub,
      displayName: jwt.name,
      username: jwt.preferred_username,
      groups: [],
      admin: jwt.groups?.includes('Community Admin') ?? false,
    };
  }
}
