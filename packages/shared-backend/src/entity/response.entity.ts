import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

export enum ResponseStatus {
  OK = '200',
  CREATED = '201',
  NO_CONTENT = '204',
  BAD_REQUEST = '400',
  UNAUTHORIZED = '401',
}

export class ResponseEntity<T> {
  @ApiProperty()
  statusCode: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;

  public constructor(status: ResponseStatus, message: string, data: T) {
    this.statusCode = ResponseStatus[status];
    this.message = message;
    this.data = data;
  }
}
