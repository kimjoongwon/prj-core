import { PrismaService } from 'nestjs-prisma';
import { CreateTenancyDto } from './dto/create-tenancy.dto';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenancyRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsert(createTenancyDto: CreateTenancyDto) {
    const { spaceId } = createTenancyDto;
    return this.prisma.tenancy.upsert({
      where: {
        spaceId,
      },
      create: createTenancyDto,
      update: createTenancyDto,
    });
  }

  findBySpaceId(spaceId: string) {
    return this.prisma.tenancy.findUnique({
      where: { spaceId },
    });
  }

  findMany(args: Prisma.TenancyFindManyArgs) {
    return this.prisma.tenancy.findMany(args);
  }
}
