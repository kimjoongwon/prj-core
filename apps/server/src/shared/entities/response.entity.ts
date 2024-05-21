import { ApiProperty } from '@nestjs/swagger';

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

// import { HttpStatus } from '@nestjs/common';
// import { ApiProperty } from '@nestjs/swagger';

// export class ResponseEntity<T> {
//   @ApiProperty()
//   statusCode: HttpStatus;

//   @ApiProperty()
//   message: string;

//   @ApiProperty()
//   data?: T;

//   constructor(statusCode: HttpStatus, message: string, data?: T) {
//     this.statusCode = statusCode;
//     this.message = message;
//     this.data = data;
//   }
// }
