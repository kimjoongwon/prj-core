import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { PrismaService } from 'nestjs-prisma';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { GroupDto } from './dtos/group.dto';
import { CreateGroupDto } from './dtos/create-group.dto';
import { GroupsRepository } from './groups.repository';

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
  removedAt: undefined,
};

describe('GroupsService', () => {
  let groupsService: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService, PrismaService, GroupsRepository],
    }).compile();

    groupsService = module.get<GroupsService>(GroupsService);
  });

  it('그룹을 생성합니다.', async () => {
    const spy = vitest
      .spyOn(groupsService, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockGroupDto) as any);

    await groupsService.create(mockCreateGroupDto);

    expect(spy).toHaveBeenCalledWith(mockCreateGroupDto);
    expect(await groupsService.create(mockCreateGroupDto)).toBeDefined();
  });
});
