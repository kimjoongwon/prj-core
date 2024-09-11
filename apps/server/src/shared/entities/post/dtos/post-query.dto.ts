import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { IntersectionType, PartialType } from '@nestjs/swagger';
import { UpdatePostDto } from './update-post.dto';
import { Prisma } from '@prisma/client';
import { EnumFieldOptional } from '../../../decorators/field.decorators';

class PostSortOrder {
  @EnumFieldOptional(() => Prisma.SortOrder)
  createdAtSortOrder: Prisma.SortOrder;
}

export class PostQueryDto extends IntersectionType(
  PartialType(UpdatePostDto),
  PostSortOrder,
  PageQueryDto,
) {}
