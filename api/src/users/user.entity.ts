import { IsEmail, IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryColumn, JoinTable, ManyToMany } from 'typeorm';
import { ReallianceIdJwt } from './jwt';
import { Group } from '../groups/group.entity';

export class UpdateUser {
  description?: string;
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

  @Column()
  @IsNotEmpty()
  admin: boolean;

  @ManyToMany(() => Group, (group) => group.users)
  @JoinTable()
  groups: Group[];

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
