import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesController } from './admin-templates.controller';
import { beforeEach, describe, expect, it } from 'vitest';
import { TemplateService } from '@shared';

describe('TemplatesController', () => {
  let controller: TemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplatesController],
      providers: [TemplateService],
    }).compile();

    controller = module.get<TemplatesController>(TemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
