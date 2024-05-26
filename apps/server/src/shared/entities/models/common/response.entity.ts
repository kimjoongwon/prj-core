import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from '../../dtos/common/page-meta.dto';
import { ClassField } from '../../../decorators/field.decorators';

export class ResponseEntity<T> {
  @ApiProperty({
    enum: HttpStatus,
  })
  httpStatus: HttpStatus;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data?: T;

  @ClassField(() => PageMetaDto)
  readonly meta: PageMetaDto;

  constructor(
    httpStatus: HttpStatus,
    message: string,
    data?: T,
    meta?: PageMetaDto,
  ) {
    this.httpStatus = httpStatus;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}
