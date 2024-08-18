import { Test, TestingModule } from '@nestjs/testing';
import { TimelineItemController } from './timeline-item.controller';
import { TimelineItemService } from './timeline-item.service';

describe('TimelineItemController', () => {
  let controller: TimelineItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimelineItemController],
      providers: [TimelineItemService],
    }).compile();

    controller = module.get<TimelineItemController>(TimelineItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
