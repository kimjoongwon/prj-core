import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { beforeEach, describe, expect, it } from 'vitest';
import { RoleService } from '@shared';

describe('RolesController', () => {
  let controller: RolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RoleService],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
