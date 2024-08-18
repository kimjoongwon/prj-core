import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { PrismaService } from 'nestjs-prisma';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { GroupDto } from './dtos/group.dto';
import { CreateGroupDto } from './dtos/create-group.dto';
import { GroupRepository } from './group.repository';

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

describe('GroupService', () => {
  let groupervice: GroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupService, PrismaService, GroupRepository],
    }).compile();

    groupervice = module.get<GroupService>(GroupService);
  });

  it('그룹을 생성합니다.', async () => {
    const spy = vitest
      .spyOn(groupervice, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockGroupDto) as any);

    await groupervice.create(mockCreateGroupDto);

    expect(spy).toHaveBeenCalledWith(mockCreateGroupDto);
    expect(await groupervice.create(mockCreateGroupDto)).toBeDefined();
  });
});
