import { IsEmail, IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ReallianceIdJwt } from './jwt';

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

  static fromJwt(jwt: ReallianceIdJwt): User {
    return {
      id: jwt.sub,
      displayName: jwt.name,
      username: jwt.preferred_username,
    };
  }
}