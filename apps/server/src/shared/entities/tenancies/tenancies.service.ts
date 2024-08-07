import { Injectable } from '@nestjs/common';
import { CreateTenancyDto } from './dto/create-tenancy.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TenanciesService {
  constructor(private readonly prisma: PrismaService) {}
  createOrUpdate(createTenancyDto: CreateTenancyDto) {
    const { spaceId } = createTenancyDto;
    return this.prisma.tenancy.upsert({
      where: {
        spaceId,
      },
      create: createTenancyDto,
      update: createTenancyDto,
    });
  }

  findOneBySpaceId(spaceId: string) {
    return this.prisma.tenancy.findUnique({
      where: { id: spaceId },
    });
  }

  getTenancies() {}
}
