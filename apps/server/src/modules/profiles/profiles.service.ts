import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileInput } from './dto/update-profile.input';
import { CreateProfileInput } from './dto/create-profile.input';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfileInput: CreateProfileInput) {
    return createProfileInput;
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
    return `This action updates a #${updateProfileInput.id} profile`;
  }

  remove(id: string) {
    return `This action removes a #${id} profile`;
  }
}
