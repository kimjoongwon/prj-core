import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { PrismaService } from 'nestjs-prisma';
import { GroupDto } from '../../dtos';
import { vitest } from 'vitest';
import { GroupsRepository } from '../../repositories';

const mockCreateGroupDto = {
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
  let service: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupsService, PrismaService, GroupsRepository],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  it('그룹을 생성합니다.', async () => {
    vitest
      .spyOn(service, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockGroupDto) as any);

    expect((await service.create(mockCreateGroupDto)).name).toEqual(
      mockCreateGroupDto.name,
    );
  });
});
