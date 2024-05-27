import { Test, TestingModule } from '@nestjs/testing';
import { GroupsRepository } from './groups.repository';

describe('AssignmentsService', () => {
  let groupsRepository: GroupsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsRepository],
    }).compile();

    groupsRepository = module.get<GroupsRepository>('GroupsRepository');
  });

  it('should be defined', () => {
    expect(groupsRepository).toBeDefined();
  });
});
