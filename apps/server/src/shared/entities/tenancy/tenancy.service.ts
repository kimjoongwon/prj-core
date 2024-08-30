import { Injectable } from '@nestjs/common';
import { CreateTenancyDto } from './dto/create-tenancy.dto';
import { TenancyRepository } from './tenancy.repository';
import { CreateSpaceDto } from '../space/dtos/create-space.dto';

@Injectable()
export class TenancyService {
  constructor(private readonly repository: TenancyRepository) {}
  create(createSpaceDto: CreateSpaceDto) {
    return this.repository.create({
      data: {
        space: {
          connectOrCreate: {
            where: {
              name: createSpaceDto.name,
            },
            create: {
              ...createSpaceDto,
            },
          },
        },
      },
      include: { space: true },
    });
  }

  createOrUpdate(createTenancyDto: CreateTenancyDto) {
    return this.repository.upsert(createTenancyDto);
  }

  findOneBySpaceId(spaceId: string) {
    return this.repository.findBySpaceId(spaceId);
  }

  getTenancy() {}
}
