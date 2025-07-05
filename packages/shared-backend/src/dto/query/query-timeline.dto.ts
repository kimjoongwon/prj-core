import { Transform, Type } from 'class-transformer';
import { QueryDto } from './query.dto';
import { IsOptional } from 'class-validator';

export class QueryTimelineDto extends QueryDto {
  // @UUIDFieldOptional({ nullable: true, default: null })
  @IsOptional()
  @Transform(({ value }) => (value === 'null' ? null : value))
  timelineId: string | null;
}
