import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ClassField } from '../../../decorators/field.decorators';
import { PageMetaDto } from '../dtos/page-meta.dto';

export class ResponseEntity<T> {
  @ApiProperty({
    enum: HttpStatus,
  })
  httpStatus: HttpStatus;

  @ApiProperty()
  message: string;

  @ApiProperty({ nullable: true })
  data: T | null = null;

  @ClassField(() => PageMetaDto)
  readonly meta: PageMetaDto;

  constructor(httpStatus: HttpStatus, message: string, data?: T, meta?: PageMetaDto) {
    this.httpStatus = httpStatus;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static WITH_SUCCESS<T>(message: string): ResponseEntity<T> {
    return new ResponseEntity(HttpStatus.OK, message || '성공');
  }

  static WITH_ERROR<T>(httpStatus: HttpStatus, message: string): ResponseEntity<T> {
    return new ResponseEntity(httpStatus, message || '실패', null);
  }

  from(data: T): ResponseEntity<T> {
    return new ResponseEntity(this.httpStatus, '성공', data, this.meta);
  }
}
