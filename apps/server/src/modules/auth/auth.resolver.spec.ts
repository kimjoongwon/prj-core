import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { beforeEach } from 'vitest';
import { expect, it, describe } from 'vitest';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthConfig } from '@configs';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GqlAuthGuard } from '@guards';
import { PasswordService } from './providers/password.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.registerAsync({
          useFactory: async (configService: ConfigService) => {
            const authConfig = configService.get<AuthConfig>('auth');
            return {
              secret: authConfig.secret,
              signOptions: { expiresIn: authConfig.expires },
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        JwtStrategy,
        GqlAuthGuard,
        AuthResolver,
        PasswordService,
      ],
      exports: [AuthService],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
