import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export enum ResponseStatus {
  OK = '200',
  CREATED = '201',
  NO_CONTENT = '204',
  BAD_REQUEST = '400',
  UNAUTHORIZED = '401',
}

export class ResponseEntity<T> {
  // private 필드들은 모두 @Exclude()로 제외
  @Exclude() private readonly _statusCode: string;
  @Exclude() private readonly _message: string;
  @Exclude() private readonly _data: T;

  public constructor(status: ResponseStatus, message: string, data: T) {
    this._statusCode = ResponseStatus[status];
    this._message = message;
    this._data = data;
  }

  // getter 는 모두 @Expose()로 공개
  @Expose()
  @ApiProperty()
  get statusCode(): string {
    return this._statusCode;
  }

  @Expose()
  @ApiProperty()
  get message(): string {
    return this._message;
  }

  @Expose()
  @ApiProperty()
  get data(): T {
    return this._data;
  }
}
