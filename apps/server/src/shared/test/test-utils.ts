import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from '@shared/schema';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaService } from 'nestjs-prisma';

export type MockedPrismaService = DeepMockProxy<PrismaService>;

export const createMockPrismaService = (): MockedPrismaService => {
  return mockDeep<PrismaService>();
};

export const resetMockPrismaService = (prisma: MockedPrismaService): void => {
  mockReset(prisma);
};

export interface TestUserData {
  id: string;
  name: string;
  phone: string;
  password: string;
  email: string;
  spaceId: string;
  tenants?: Array<{
    id: string;
    main: boolean;
    spaceId: string;
    roleId: string;
  }>;
  profiles?: Array<{
    name: string;
    nickname: string;
  }>;
}

export const createTestUser = (overrides: Partial<TestUserData> = {}): TestUserData => {
  return {
    id: 'user-test-id',
    name: 'test@example.com',
    phone: '010-1234-5678',
    password: '$2b$10$hashedPassword',
    email: 'test@example.com',
    spaceId: 'space-test-id',
    tenants: [
      {
        id: 'tenant-test-id',
        main: true,
        spaceId: 'space-test-id',
        roleId: 'role-test-id',
      },
    ],
    profiles: [
      {
        name: 'Test User',
        nickname: 'testuser',
      },
    ],
    ...overrides,
  };
};

export const createTestUserDto = (overrides: Partial<UserDto> = {}): UserDto => {
  return {
    id: 'user-test-id',
    spaceId: 'space-test-id',
    email: 'test@example.com',
    name: 'Test User',
    phone: '010-1234-5678',
    password: '$2b$10$hashedPassword',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tenants: [
      {
        id: 'tenant-test-id',
        name: 'Test Tenant',
        main: true,
        spaceId: 'space-test-id',
        roleId: 'role-test-id',
        space: {
          id: 'space-test-id',
          name: 'Test Space',
          ground: {
            id: 'ground-test-id',
            name: 'Test Ground',
          },
        },
      } as any,
    ],
    ...overrides,
  } as UserDto;
};

export interface TestTokens {
  accessToken: string;
  refreshToken: string;
}

export const createTestTokens = (userId: string = 'user-test-id'): TestTokens => {
  return {
    accessToken: `test-access-token-${userId}`,
    refreshToken: `test-refresh-token-${userId}`,
  };
};

export const createMockJwtService = (): Partial<JwtService> => {
  return {
    sign: jest.fn().mockImplementation((payload) => `mock-token-${JSON.stringify(payload)}`),
    verify: jest.fn().mockImplementation((token) => {
      if (token.includes('user-test-id')) {
        return { userId: 'user-test-id' };
      }
      throw new Error('Invalid token');
    }),
  };
};

export const setupTestModule = async (
  providers: any[],
  overrides: Record<string, any> = {}
): Promise<TestingModule> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ...providers,
      {
        provide: PrismaService,
        useValue: overrides.prisma || createMockPrismaService(),
      },
      {
        provide: JwtService,
        useValue: overrides.jwtService || createMockJwtService(),
      },
      ...Object.entries(overrides).map(([provide, useValue]) => ({
        provide,
        useValue,
      })),
    ],
  }).compile();

  return module;
};

export const expectToThrowAsync = async (
  fn: () => Promise<any>,
  errorClass?: any,
  errorMessage?: string | RegExp
): Promise<void> => {
  let error: any;
  try {
    await fn();
  } catch (e) {
    error = e;
  }

  expect(error).toBeDefined();
  if (errorClass) {
    expect(error).toBeInstanceOf(errorClass);
  }
  if (errorMessage) {
    if (typeof errorMessage === 'string') {
      expect(error.message).toBe(errorMessage);
    } else {
      expect(error.message).toMatch(errorMessage);
    }
  }
};