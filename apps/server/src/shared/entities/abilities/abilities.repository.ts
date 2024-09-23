import { CreateAbilityDto } from './dto/create-ability.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AbilitiesRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(createAbilityDto: CreateAbilityDto) {
    return this.prisma.ability.create({
      data: createAbilityDto,
    });
  }

  findMany(args: Prisma.AbilityFindManyArgs) {
    return this.prisma.ability.findMany(args);
  }

  findUnique(args: Prisma.AbilityFindUniqueArgs) {
    return this.prisma.ability.findUnique(args);
  }

  update(args: Prisma.AbilityUpdateArgs) {
    return this.prisma.ability.update(args);
  }

  updateMany(args: Prisma.AbilityUpdateManyArgs) {
    return this.prisma.ability.updateMany(args);
  }

  delete(args: Prisma.AbilityDeleteArgs) {
    return this.prisma.ability.delete(args);
  }
}
