import { PrismaService } from 'nestjs-prisma';
import { CreateTenancyDto } from './dto/create-tenancy.dto';
import { Prisma } from '@prisma/client';

export class TenanciesRepository {
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

  findMany(args: Prisma.TenancyFindManyArgs) {
    return this.prisma.tenancy.findMany(args);
  }
}
