import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { PrismaService } from 'nestjs-prisma';
import { GroupsService } from '@shared';

describe('GroupsController', () => {
  let controller: GroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [GroupsService, PrismaService],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
