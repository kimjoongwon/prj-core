import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { EnumFieldOptional } from '../../../decorators/field.decorators';
import { Prisma } from '@prisma/client';
import { UpdateLectureDto } from './update-lecture.dto';

export class LectureSortOrder {
  @EnumFieldOptional(() => Prisma.SortOrder)
  nameSortOrder?: string;
}

export class LectureQueryDto extends IntersectionType(
  PartialType(UpdateLectureDto),
  LectureSortOrder,
  PageQueryDto,
) {}
