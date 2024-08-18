import { Injectable } from '@nestjs/common';
import { CreateTenancyDto } from './dto/create-tenancy.dto';
import { TenancyRepository } from './tenancy.repository';

@Injectable()
export class TenancyService {
  constructor(private readonly repository: TenancyRepository) {}
  createOrUpdate(createTenancyDto: CreateTenancyDto) {
    return this.repository.upsert(createTenancyDto);
  }

  findOneBySpaceId(spaceId: string) {
    return this.repository.findBySpaceId(spaceId);
  }

  getTenancy() {}
}
