import { Test, TestingModule } from '@nestjs/testing';
import { TimelineItemsService } from './timeline-items.service';
import { beforeEach, describe, expect, it } from 'vitest';

describe('TimelineItemsService', () => {
  let service: TimelineItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimelineItemsService],
    }).compile();

    service = module.get<TimelineItemsService>(TimelineItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
