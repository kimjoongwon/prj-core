import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(args: Prisma.CategoryCreateArgs) {
    const services = await this.prisma.category.create(args);
    return services;
  }

  getFirst(args: Prisma.CategoryFindFirstArgs) {
    return this.prisma.category.findFirst(args);
  }

  createMany(args: Prisma.CategoryCreateManyArgs) {
    return this.prisma.category.createMany(args);
  }

  getUnique(args: Prisma.CategoryFindUniqueArgs) {
    return this.prisma.category.findUnique(args);
  }

  findCategoryById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  getMany(args: Prisma.CategoryFindManyArgs) {
    return this.prisma.category.findMany(args);
  }

  async getManyByQuery(args: Prisma.CategoryFindManyArgs) {
    const categories = await this.prisma.category.findMany({
      ...args,
      include: {
        children: true,
      },
    });
    const count = await this.prisma.category.count({
      where: args.where,
    });

    return {
      categories,
      count,
    };
  }
}
