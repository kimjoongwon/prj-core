import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseEntity<T> {
  @ApiProperty({
    enum: HttpStatus,
  })
  httpStatus: HttpStatus;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data?: T;

  constructor(httpStatus: HttpStatus, message: string, data?: T) {
    this.httpStatus = httpStatus;
    this.message = message;
    this.data = data;
  }
}
