import { Test, TestingModule } from '@nestjs/testing';
import { AbilitiesController } from './abilities.controller';
import { describe, beforeEach, it, expect } from 'vitest';
import { AbilityService } from '@shared';

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
