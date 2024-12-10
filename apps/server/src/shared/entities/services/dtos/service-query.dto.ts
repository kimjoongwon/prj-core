import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { IntersectionType } from '@nestjs/swagger';
import { UpdateServiceDto } from './update-service.dto';
import { Prisma } from '@prisma/client';

class ServiceSortOrder {
  @EnumFieldOptional(() => Prisma.SortOrder, { default: Prisma.SortOrder })
  nameSortOrder?: Prisma.SortOrder;
}

export class ServiceQueryDto extends IntersectionType(
  UpdateServiceDto,
  PageQueryDto,
  ServiceSortOrder,
) {}
