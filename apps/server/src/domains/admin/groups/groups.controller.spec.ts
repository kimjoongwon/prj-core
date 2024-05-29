import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { PrismaService } from 'nestjs-prisma';
import { GroupsRepository, GroupsService } from '@shared';
import { vitest } from 'vitest';

describe('GroupsController', () => {
  let controller: GroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [GroupsService, PrismaService, GroupsRepository],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
  });

  it('should be defined', () => {
    vitest
      .spyOn(controller, 'createGroup')
      .mockImplementation(() => Promise.resolve({} as any));

    expect(controller).toBeDefined();
  });
});
