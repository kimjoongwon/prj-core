import { Test, TestingModule } from '@nestjs/testing';
import { TenanciesService } from './tenancies.service';

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
