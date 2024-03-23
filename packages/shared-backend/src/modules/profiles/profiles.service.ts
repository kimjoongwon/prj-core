import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CompleteProfile, ProfileDto } from '../../../prisma/src/zod';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfileDto: ProfileDto) {
    return this.prisma.profile.create({
      data: createProfileDto,
      include: { user: true },
    });
  }
}
