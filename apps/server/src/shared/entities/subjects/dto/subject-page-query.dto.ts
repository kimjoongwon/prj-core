import { IntersectionType, PartialType } from '@nestjs/swagger';
import { OrderByDto } from '../../common/dtos/order-by.dto';
import { SubjectDto } from './subject.dto';
import { PageOptionsDto } from '../../common/dtos/page-option.dto';

class SubjectOrderBy extends OrderByDto {
  nameSortOrder?: 'asc' | 'desc';
}

export class SubjectPageQueryDto extends IntersectionType(
  PageOptionsDto,
  PartialType(SubjectDto),
  SubjectOrderBy,
) {}
