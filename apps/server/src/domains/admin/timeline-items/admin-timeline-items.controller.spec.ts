import { Test, TestingModule } from '@nestjs/testing';
import { TimelineItemsController } from './admin-timeline-items.controller';
import { beforeEach, describe, expect, it } from 'vitest';
import { TimelineItemService } from '@shared';

describe('TimelineItemsController', () => {
  let controller: TimelineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimelineItemsController],
      providers: [TimelineItemService],
    }).compile();

    controller = module.get<TimelineItemsController>(TimelineItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
