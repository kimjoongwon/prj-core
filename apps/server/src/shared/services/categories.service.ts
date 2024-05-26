import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { ResponseEntity } from '../entities';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const services = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return services;
  }

  getCategoryById(id: string) {
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

  async getCategoriesByServiceSpace({
    serviceId,
    spaceId,
  }: {
    spaceId: string;
    serviceId: string;
  }) {
    const services = await this.prisma.category.findMany({
      where: {
        serviceId,
        spaceId,
        deletedAt: null,
      },
    });
    return new ResponseEntity(
      HttpStatus.OK,
      'Successfully fetched categories',
      services.map((service) => new CategoryDto(service)),
    );
  }
}
