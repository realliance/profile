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

  async create(group: Omit<Group, 'id'>): Promise<Group> {
    return await this.groupsRepository.save(group);
  }

  findAll(): Promise<Group[]> {
    return this.groupsRepository.find();
  }

  findOneBy(Group: Partial<Group>): Promise<Group | null> {
    return this.groupsRepository.findOneBy(Group);
  }

  async remove(id: string): Promise<void> {
    await this.groupsRepository.delete(id);
  }

  async updateGroup(id: string, newGroup: Partial<Group>): Promise<void> {
    await this.groupsRepository.update(id, newGroup);
  }
}
