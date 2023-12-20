import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryColumn, ManyToMany } from 'typeorm';

@Entity()
export class Group {
  @PrimaryColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];
}