import { Test, TestingModule } from '@nestjs/testing';
import { TimelineItemsController } from './timeline-items.controller';
import { TimelineItemsService } from './timeline-items.service';

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
