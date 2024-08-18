import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './sessions.controller';
import { beforeEach, describe, expect, it } from 'vitest';
import { SessionService } from '@shared';

describe('SessionController', () => {
  let controller: SessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [SessionService],
    }).compile();

    controller = module.get<SessionController>(SessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
