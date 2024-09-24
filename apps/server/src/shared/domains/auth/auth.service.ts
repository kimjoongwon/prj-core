import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from '../password/password.service';
import { UsersService, ResponseEntity, UserDto, RolesService } from '../../entities';
import { goTryRawSync } from '../../libs';
import { TokenService, TokenPayloadDto } from '../token';
import { SignUpPayloadDto } from './dtos/sign-up-payload.dto';
import { LoginPayloadDto } from './dtos/login-payload.dto';
import { RoleService } from '../role/role.service';

@Injectable()
export class AuthService {
  logger: Logger = new Logger(AuthService.name);
  LOG_PREFIX = `${AuthService.name} DB_INIT`;
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private prisma: PrismaService,
  ) {}

  async getCurrentUser(accessToken: string) {
    const [err, { userId }] = goTryRawSync<Error, TokenPayloadDto>(() =>
      this.jwtService.verify<{ userId: string }>(accessToken),
    );
    if (err) throw new BadRequestException('Invalid token');

    return this.usersService.getUniqueById(userId);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUniqueByEmail(email);

    const isPasswordValid = await this.passwordService.validatePassword(password, user?.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        ResponseEntity.WITH_ERROR(HttpStatus.UNAUTHORIZED, '패스워드가 일치하지 않습니다.'),
      );
    }

    return user;
  }

  async signUpUser(signUpPayloadDto: SignUpPayloadDto) {
    const { email, name, nickname, password, phone, spaceId } = signUpPayloadDto;

    await this.prisma.$transaction(async (tx) => {
      const hashedPassword = await this.passwordService.hashPassword(password);

      const newUser = new UserDto(
        await tx.user.create({
          data: {
            email,
            name,
            phone,
            password: hashedPassword,
          },
        }),
      );

      const userRole = await this.rolesService.getUnique({ where: { name: 'USER' } });

      const tenancy = await tx.tenancy.findUnique({
        where: {
          id: spaceId,
        },
      });

      await tx.tenant.create({
        data: {
          type: 'PHYSICAL',
          active: true,
          userId: newUser.id,
          tenancyId: tenancy.id,
          roleId: userRole.id,
        },
      });

      await tx.profile.create({
        data: {
          nickname,
          userId: newUser.id,
        },
      });

      return this.tokenService.generateTokens({ userId: newUser.id });
    });
  }

  async login({ email, password }: LoginPayloadDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profiles: true,
        tenants: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: {
        userId: user.id,
        active: true,
      },
      include: {
        role: true,
        tenancy: true,
      },
    });

    const passwordValid = await this.passwordService.validatePassword(password, user.password);

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const { accessToken, refreshToken } = this.tokenService.generateTokens({ userId: user.id });

    return {
      accessToken,
      refreshToken,
      user,
      tenant,
    };
  }

  async createSuperAdmin(signUpPayloadDto: SignUpPayloadDto) {
    // const { email, name, nickname, password, phone, spaceId } = signUpPayloadDto;
    // const hashedPassword = await this.passwordService.hashPassword(password);
    // const newUser = await this.usersService.upsert({
    //   email,
    //   name,
    //   phone,
    //   password: hashedPassword,
    // });
    // const userId = newUser.id;
    // await this.prisma.profile.upsert({
    //   where: {
    //     userId,
    //   },
    //   update: {
    //     userId,
    //     nickname,
    //   },
    //   create: {
    //     userId,
    //     nickname,
    //   },
    // });
    // const superAdminRole = await this.roleService.findSuperAdminRole();
    // let newSpaceId = null;
    // const space = await this.spacesService.getUnique(spaceId);
    // if (!space) {
    //   newSpaceId = this.spacesService.create({
    //     name: 'Galaxy',
    //   });
    // } else {
    //   newSpaceId = space.id;
    // }
    // await this.tenantService.createOrUpdate({
    //   tenancyId: tenancy.id,
    //   userId: newUser.id,
    //   active: true,
    //   roleId: superAdminRole.id,
    //   type: 'PHYSICAL',
    // });
  }
}
