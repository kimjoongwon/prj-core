import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupCategoriesResolver } from './user-group-categories.resolver';
import { UserGroupCategoriesService } from './user-group-categories.service';

describe('UserGroupCategoriesResolver', () => {
  let resolver: UserGroupCategoriesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserGroupCategoriesResolver, UserGroupCategoriesService],
    }).compile();

    resolver = module.get<UserGroupCategoriesResolver>(
      UserGroupCategoriesResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
