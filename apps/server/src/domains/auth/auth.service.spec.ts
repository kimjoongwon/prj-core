import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  AuthConfig,
  ProfilesModule,
  RolesModule,
  SpacesModule,
  TenantsModule,
  UsersModule,
} from '@shared';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RolesModule,
        SpacesModule,
        TenantsModule,
        UsersModule,
        ProfilesModule,
        PassportModule,
        JwtModule.registerAsync({
          useFactory: async (config: ConfigService) => {
            const authConfig = await config.get<AuthConfig>('auth');
            return {
              secret: authConfig?.secret,
              signOptions: { expiresIn: authConfig?.expires },
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
