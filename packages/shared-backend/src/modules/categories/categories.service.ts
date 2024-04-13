import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from 'nestjs-prisma';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ServiceSpaceDto } from '../../dto';
import { ResponseEntity, ResponseStatus } from '../../entity';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const services = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return services;
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async getCategoriesByServiceSpace({ serviceId, spaceId }: ServiceSpaceDto) {
    const services = await this.prisma.category.findMany();
    return new ResponseEntity(
      ResponseStatus.OK,
      'Successfully fetched categories',
      services.map(service => new CategoryEntity(service)),
    );
  }
}
