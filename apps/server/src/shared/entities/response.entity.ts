import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ClassField } from '../decorators/field.decorators';
import { PageMetaDto } from '../dtos/query/page-meta.dto';

export class ResponseEntity<T> {
  @ApiProperty({
    enum: HttpStatus,
  })
  httpStatus: HttpStatus;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: T;

  @ClassField(() => PageMetaDto, { nullable: true, required: false })
  readonly meta?: PageMetaDto;

  constructor(httpStatus: HttpStatus, message: string, data?: T, meta?: PageMetaDto) {
    this.httpStatus = httpStatus;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static WITH_SUCCESS<T>(message: string): ResponseEntity<T> {
    return new ResponseEntity(HttpStatus.OK, message || '성공');
  }

  static WITH_ERROR<T>(
    httpStatus: HttpStatus,
    message: string,
    data?: T | null,
  ): ResponseEntity<T> {
    return new ResponseEntity(httpStatus, message || '실패', data);
  }

  static WITH_ROUTE<T>(data: T): ResponseEntity<T> {
    return new ResponseEntity(HttpStatus.OK, '성공', data);
  }

  from(data: T): ResponseEntity<T> {
    return new ResponseEntity(this.httpStatus, '성공', data, this.meta);
  }
}
