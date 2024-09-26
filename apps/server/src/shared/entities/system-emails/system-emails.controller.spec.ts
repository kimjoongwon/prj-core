import { Test, TestingModule } from '@nestjs/testing';
import { SystemEmailsController } from './system-emails.controller';
import { beforeEach, describe, expect, it } from 'vitest';
import { SystemEmailsService } from './system-emails.service';

describe('SystemEmailsController', () => {
  let controller: SystemEmailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemEmailsController],
      providers: [SystemEmailsService],
    }).compile();

    controller = module.get<SystemEmailsController>(SystemEmailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
