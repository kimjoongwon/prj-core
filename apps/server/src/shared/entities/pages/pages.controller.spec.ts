import { Test, TestingModule } from '@nestjs/testing';
import { PagesController } from './pages.controller';
import { beforeEach, describe, expect, it } from 'vitest';
import { PagesService } from './pages.service';

describe('PagesController', () => {
  let controller: PagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagesController],
      providers: [PagesService],
    }).compile();

    controller = module.get<PagesController>(PagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
