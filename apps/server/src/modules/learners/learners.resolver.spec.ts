import { Test, TestingModule } from '@nestjs/testing';
import { LearnersResolver } from './learners.resolver';
import { LearnersService } from './learners.service';

describe('LearnersResolver', () => {
  let resolver: LearnersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LearnersResolver, LearnersService],
    }).compile();

    resolver = module.get<LearnersResolver>(LearnersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
