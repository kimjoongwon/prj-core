import { Test, TestingModule } from '@nestjs/testing';
import { SpaceService } from './space.service';
import { PrismaService } from 'nestjs-prisma';
import { beforeEach, describe, expect, it } from 'vitest';

describe('SpaceService', () => {
  let service: SpaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpaceService, PrismaService],
    }).compile();

    service = module.get<SpaceService>(SpaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
