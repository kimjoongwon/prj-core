import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { PrismaService } from 'nestjs-prisma';
import { CreateGroupDto, GroupDto } from '../../dtos';
import { vitest } from 'vitest';
import { GroupsRepository } from '../../repositories';

const mockCreateGroupDto: CreateGroupDto = {
  name: 'Test Group',
  spaceId: 'clvwldwkh0000dk8a7vdqibsm',
  serviceId: 'clvwldwrv0003dk8a2exnygtq',
};

const mockGroupDto: GroupDto = {
  id: '',
  ...mockCreateGroupDto,
  createdAt: undefined,
  updatedAt: undefined,
  deletedAt: undefined,
};

describe('GroupsService', () => {
  let groupService: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService, PrismaService, GroupsRepository],
    }).compile();

    groupService = module.get<GroupsService>(GroupsService);
  });

  it('그룹을 생성합니다.', async () => {
    const spy = vitest
      .spyOn(groupService, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockGroupDto) as any);

    await groupService.create(mockCreateGroupDto);

    expect(spy).toHaveBeenCalledWith(mockCreateGroupDto);
    expect(await groupService.create(mockCreateGroupDto)).toBeDefined();
  });
});
