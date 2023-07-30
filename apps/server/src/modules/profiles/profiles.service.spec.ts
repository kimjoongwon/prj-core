import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { describe, beforeEach, it, expect } from 'vitest';
import { PrismaModule } from '@modules';

describe('ProfilesService', () => {
  let service: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ProfilesService],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
