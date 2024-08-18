import { Test, TestingModule } from '@nestjs/testing';
import { AbilitiesController } from './ability.controller';
import { AbilityService } from './ability.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('AbilitiesController', () => {
  let controller: AbilitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbilitiesController],
      providers: [AbilityService],
    }).compile();

    controller = module.get<AbilitiesController>(AbilitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
