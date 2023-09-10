import { Test, TestingModule } from '@nestjs/testing';
import { UserWorkspacesResolver } from './user-workspaces.resolver';
import { UserWorkspacesService } from './user-workspaces.service';

describe('UserWorkspacesResolver', () => {
  let resolver: UserWorkspacesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserWorkspacesResolver, UserWorkspacesService],
    }).compile();

    resolver = module.get<UserWorkspacesResolver>(UserWorkspacesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
