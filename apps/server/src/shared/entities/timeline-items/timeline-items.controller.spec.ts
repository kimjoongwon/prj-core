import { Test, TestingModule } from '@nestjs/testing';
import { TimelineItemsService } from './timeline-items.service';
import { beforeEach, describe, expect, it } from 'vitest';
import { TimelineItemsController } from './timeline-items.controller';

describe('TimelineItemsController', () => {
  let controller: TimelineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimelineItemsController],
      providers: [TimelineItemsService],
    }).compile();

    controller = module.get<TimelineItemsController>(TimelineItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
