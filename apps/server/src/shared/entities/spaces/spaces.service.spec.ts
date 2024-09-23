import { Test, TestingModule } from '@nestjs/testing';
import { SpacesService } from './spaces.service';
import { PrismaService } from 'nestjs-prisma';
import { beforeEach, describe, expect, it } from 'vitest';

describe('SpaceService', () => {
  let service: SpacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpacesService, PrismaService],
    }).compile();

    service = module.get<SpacesService>(SpacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
