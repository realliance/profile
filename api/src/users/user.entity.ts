import { IsEmail, IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  displayName: string;

  @Column({ unique: true })
  @IsEmail()
  username: string;
}