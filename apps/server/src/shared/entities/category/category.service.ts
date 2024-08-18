import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { ResponseEntity } from '../common/response.entity';
import { CategoryDto } from './dtos/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const services = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return services;
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
