import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesResolver } from './profiles.resolver';
import { ProfilesService } from './profiles.service';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { PrismaModule } from '@modules';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { Profile } from '@prisma/client';

const moduleMocker = new ModuleMocker(global);

describe('ProfilesResolver', () => {
  let resolver: ProfilesResolver;
  let profilesService: ProfilesService;

  const result: Profile[] = [
    {
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      nickname: 'test1',
      phone: '123456789',
      userId: '1',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ProfilesResolver, ProfilesService],
    })
      .useMocker(token => {
        if (token === ProfilesService) {
          return { findAll: vi.fn().mockResolvedValue(result) };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    profilesService = module.get<ProfilesService>(ProfilesService);
    resolver = module.get<ProfilesResolver>(ProfilesResolver);

    // expect(resolver.findAll()).toReturnWith(['test1', 'test2']);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('findAll', async () => {
    vi.spyOn(profilesService, 'findAll').mockResolvedValue(result);
    expect(await resolver.findAll()).toBe(result);
    expect(result[0].nickname).toBe('test1');
    expect(result[0]).toHaveProperty('nickname');
  });
});
