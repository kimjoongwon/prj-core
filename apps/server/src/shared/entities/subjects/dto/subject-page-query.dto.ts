import { IntersectionType, PartialType } from '@nestjs/swagger';
import { OrderByDto } from '../../common/dtos/order-by.dto';
import { SubjectDto } from './subject.dto';
import { PageQueryDto } from '../../common/dtos/page-query.dto';

class SubjectOrderBy extends OrderByDto {
  nameSortOrder?: 'asc' | 'desc';
}

export class SubjectPageQueryDto extends IntersectionType(
  PageQueryDto,
  PartialType(SubjectDto),
  SubjectOrderBy,
) {}
