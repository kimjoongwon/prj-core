import { OmitType } from '@nestjs/swagger';
import { TenancyDto } from './tenancy.dto';

export class CreateTenancyDto extends OmitType(TenancyDto, [
  'id',
  'createdAt',
  'deletedAt',
  'updatedAt',
]) {}
