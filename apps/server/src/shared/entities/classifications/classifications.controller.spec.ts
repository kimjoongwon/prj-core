import { Test, TestingModule } from '@nestjs/testing';
import { ClassificationsController } from './classifications.controller';
import { beforeEach, describe, expect, it } from 'vitest';
import { ClassificationsService } from './classifications.service';

describe('ClassificationsController', () => {
  let controller: ClassificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassificationsController],
      providers: [ClassificationsService],
    }).compile();

    controller = module.get<ClassificationsController>(ClassificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
