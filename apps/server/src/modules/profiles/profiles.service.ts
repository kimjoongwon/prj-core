import { Injectable } from '@nestjs/common';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { PrismaService } from '../prisma/prisma.service';
// import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfileInput: CreateProfileInput) {
    return null;
  }

  findAll() {
    return this.prisma.profile.findMany();
  }

  findOneByUserId(userId: string) {
    return this.prisma.profile.findUnique({
      where: {
        userId,
      },
    });
  }

  update(id: string, updateProfileInput: UpdateProfileInput) {
    return `This action updates a #${id} profile`;
  }

  remove(id: string) {
    return `This action removes a #${id} profile`;
  }
}
