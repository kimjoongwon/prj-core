import { Test, TestingModule } from '@nestjs/testing';
import { GroupsRepository } from './groups.repository';
import { PrismaService } from 'nestjs-prisma';

describe('groups.repository', () => {
  let groupsRepository: GroupsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsRepository, PrismaService],
    }).compile();

    groupsRepository = module.get<GroupsRepository>(GroupsRepository);
  });

  it('should be defined', () => {
    expect(groupsRepository).toBeDefined();
  });
});
