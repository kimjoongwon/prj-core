import { Test, TestingModule } from '@nestjs/testing';
import { GroupRepository } from './group.repository';
import { PrismaService } from 'nestjs-prisma';
import { beforeEach, describe, expect, it } from 'vitest';

describe('group.repository', () => {
  let groupRepository: GroupRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupRepository, PrismaService],
    }).compile();

    groupRepository = module.get<GroupRepository>(GroupRepository);
  });

  it('should be defined', () => {
    expect(groupRepository).toBeDefined();
  });
});
