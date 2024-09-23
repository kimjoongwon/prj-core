import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { PrismaService } from 'nestjs-prisma';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { GroupRepository, GroupService } from '@shared';

describe('GroupsController', () => {
  let controller: GroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [GroupService, PrismaService, GroupRepository],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
  });

  it('should be defined', () => {
    vitest.spyOn(controller, 'createGroup').mockImplementation(() => Promise.resolve({} as any));

    expect(controller).toBeDefined();
  });
});
