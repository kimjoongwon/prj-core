import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { describe, beforeEach, it, expect } from 'vitest';
import { UsersService, SpacesService, RolesService } from '../../entities';
import { PasswordModule } from '../password';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PasswordModule],
      providers: [
        PrismaService,
        AuthService,
        UsersService,
        JwtService,
        SpacesService,
        RolesService,
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
