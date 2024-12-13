import { IntersectionType, PartialType } from '@nestjs/swagger';
import { QueryDto } from '../../common/dtos/query.dto';
import { Post } from '../post.entity';
import { OrderByDto } from '../../common/dtos/order-by.dto';
import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { Prisma } from '@prisma/client';

class PostOrderBy extends OrderByDto {
  @EnumFieldOptional(() => Prisma.SortOrder)
  typeSortOrder?: Prisma.SortOrder;
}

export class PostPageQueryDto extends IntersectionType(PartialType(Post), PostOrderBy, QueryDto) {}
