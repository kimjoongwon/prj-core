import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsController } from './programs.controller';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProgramsService } from './programs.service';

describe('ProgramsController', () => {
  let controller: ProgramsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramsController],
      providers: [ProgramsService],
    }).compile();

    controller = module.get<ProgramsController>(ProgramsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
