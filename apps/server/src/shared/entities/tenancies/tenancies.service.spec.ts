import { Test, TestingModule } from '@nestjs/testing';
import { TenanciesService } from './tenancies.service';
import { describe, beforeEach, it, expect } from 'vitest';

describe('TenanciesService', () => {
  let service: TenanciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenanciesService],
    }).compile();

    service = module.get<TenanciesService>(TenanciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
