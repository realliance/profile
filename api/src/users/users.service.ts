import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { ReallianceIdJwt } from './jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneBy(user: Partial<User>): Promise<User | null> {
    return this.usersRepository.findOneBy(user);
  }

  findOneByJwt(jwt: ReallianceIdJwt): Promise<User | null> {
    return this.findOneBy({
      id: jwt.sub,
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async updateUser(
    id: string | FindOptionsWhere<User>,
    newUser: Partial<User>,
  ): Promise<void> {
    await this.usersRepository.update(id, newUser);
  }
}
