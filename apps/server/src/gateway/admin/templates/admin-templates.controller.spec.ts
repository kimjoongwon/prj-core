import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { TemplateService } from '../../../shared/domains/template/Template.service';
import { AdminTemplatesController } from './admin-templates.controller';

describe('AdminTemplatesController', () => {
  let controller: AdminTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminTemplatesController],
      providers: [TemplateService],
    }).compile();

    controller = module.get<AdminTemplatesController>(AdminTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
