import { Test, TestingModule } from '@nestjs/testing';
import { TimelineItemService } from './timeline-item.service';

describe('TimelineItemService', () => {
  let service: TimelineItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimelineItemService],
    }).compile();

    service = module.get<TimelineItemService>(TimelineItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
