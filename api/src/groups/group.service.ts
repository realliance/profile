import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
  ) {}

  new(group: Partial<Group>): Group {
    return this.groupsRepository.create(group);
  }

  async create(group: Omit<Group, 'id'>): Promise<Group> {
    return this.groupsRepository.save(this.new(group));
  }

  findAll(): Promise<Group[]> {
    return this.groupsRepository.find();
  }

  async findOneBy(group: Partial<Group>): Promise<Group | null> {
    return this.groupsRepository.findOne({
      where: group,
      relations: ['users'],
    });
  }

  async remove(id: string): Promise<void> {
    await this.groupsRepository.delete(id);
  }

  async updateGroup(newGroup: Group): Promise<Group> {
    return this.groupsRepository.save(newGroup);
  }
}
