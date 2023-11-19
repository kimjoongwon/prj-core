import { Injectable } from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';
import { UpdateProfileInput } from './dto/update-profile.input';
import { CreateProfileInput } from './dto/create-profile.input';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfileInput: CreateProfileInput) {
    return createProfileInput;
  }

  findOne(userId: string) {
    return this.prisma.profile.findUnique({
      where: {
        id: userId,
      },
    });
  }

  findMany(userId: string) {
    return this.prisma.profile.findMany({
      where: {
        id: userId,
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
