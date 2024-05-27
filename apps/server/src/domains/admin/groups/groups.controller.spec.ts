import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { PrismaService } from 'nestjs-prisma';
import { GroupsRepository, GroupsService } from '@shared';

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
    expect(controller).toBeDefined();
  });
});
