import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserSignUpDto } from './dtos/create-user-sign-up.dto';
import { ProfilesService } from 'src/profiles/profiles.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private profilesService: ProfilesService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      delete user.password;

      return user;
    }
    return null;
  }

  async signUpUser(userSignUpDto: CreateUserSignUpDto) {
    const { createProfileDto, createUserDto } = userSignUpDto;
    const newUser = await this.usersService.create(createUserDto);

    createProfileDto.userId = newUser.id;

    const newProfile = await this.profilesService.create(createProfileDto);

    return newProfile;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
