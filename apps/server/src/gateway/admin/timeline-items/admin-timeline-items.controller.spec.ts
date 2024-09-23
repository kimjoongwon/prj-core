import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AdminTimelineItemsController } from './admin-timeline-items.controller';
import { TimelineItemsService } from '@shared';

describe('TimelineItemsController', () => {
  let controller: AdminTimelineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminTimelineItemsController],
      providers: [TimelineItemsService],
    }).compile();

    controller = module.get<AdminTimelineItemsController>(AdminTimelineItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
