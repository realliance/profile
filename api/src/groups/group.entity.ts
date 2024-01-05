import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

export class NewGroup {
  name: string;
}

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];
}
