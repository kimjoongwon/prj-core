import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsService } from './subjects.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('SubjectsService', () => {
  let service: SubjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectsService],
    }).compile();

    service = module.get<SubjectsService>(SubjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
