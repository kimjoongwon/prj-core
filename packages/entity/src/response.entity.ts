import { ClassField } from "@cocrepo/decorator";
import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import type { IPageMeta } from "./types/page-meta";

/**
 * API 응답 엔티티
 * 모든 API 응답의 표준 형식을 정의합니다.
 */
export class ResponseEntity<T, M extends IPageMeta = IPageMeta> {
  @ApiProperty({
    enum: HttpStatus,
  })
  httpStatus: HttpStatus;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: T;

  @ClassField(() => Object, { nullable: true, required: false })
  readonly meta?: M;

  constructor(httpStatus: HttpStatus, message: string, data?: T, meta?: M) {
    this.httpStatus = httpStatus;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static WITH_SUCCESS<T>(message: string): ResponseEntity<T> {
    return new ResponseEntity(HttpStatus.OK, message || "성공");
  }

  static WITH_ERROR<T>(
    httpStatus: HttpStatus,
    message: string,
    data?: T | null
  ): ResponseEntity<T | null> {
    return new ResponseEntity(httpStatus, message || "실패", data);
  }

  static WITH_ROUTE<T>(data: T): ResponseEntity<T> {
    return new ResponseEntity(HttpStatus.OK, "성공", data);
  }

  from(data: T): ResponseEntity<T, M> {
    return new ResponseEntity(this.httpStatus, "성공", data, this.meta);
  }
}
