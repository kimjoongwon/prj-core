import { Test, TestingModule } from '@nestjs/testing';
import { AbilitiesController } from './abilities.controller';
import { AbilitiesService } from '../../../shared/entities/abilities/abilities.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('AbilitiesController', () => {
  let controller: AbilitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbilitiesController],
      providers: [AbilitiesService],
    }).compile();

    controller = module.get<AbilitiesController>(AbilitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
