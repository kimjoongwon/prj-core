import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { PrismaService } from 'nestjs-prisma';
import { CategoriesService } from '@shared';
import { describe, beforeEach, it, expect } from 'vitest';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService, PrismaService],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
