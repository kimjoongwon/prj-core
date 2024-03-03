import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RolesModule } from 'src/roles/roles.module';
import { UsersModule } from 'src/users/users.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthConfig } from 'src/configs';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { SpacesModule } from 'src/spaces/spaces.module';
import { TenantsModule } from 'src/tenants/tenants.module';

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
