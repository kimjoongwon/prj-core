import { HttpCode, HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiResponseProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseEntity } from '../entities/common/entities/response.entity';

export const ApiResponseEntity = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  httpStatus: HttpStatus = HttpStatus.OK,
  options?: { isArray?: boolean },
) => {
  const properties = {
    httpStatus: {
      type: 'number',
      nullable: false,
      example: httpStatus,
    },
    message: { type: 'string', nullable: false },
    data: { $ref: getSchemaPath(dataDto) },
    meta: {
      type: 'object',
      properties: {
        skip: { type: 'number', nullable: false },
        take: { type: 'number', nullable: false },
        itemCount: { type: 'number', nullable: false },
        pageCount: { type: 'number', nullable: false },
        hasNextPage: { type: 'boolean', nullable: false },
        hasPreviousPage: { type: 'boolean', nullable: false },
      },
    },
  };

  const allOf = options?.isArray
    ? [
        {
          properties: {
            httpStatus: properties.httpStatus,
            message: { type: 'string', nullable: false },
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(dataDto) },
            },
            meta: properties.meta,
          },
        },
      ]
    : [
        {
          properties,
        },
      ];

  return applyDecorators(
    ApiExtraModels(ResponseEntity, dataDto),
    ApiResponse({
      status: httpStatus,
      schema: {
        allOf,
      },
    }),
    HttpCode(httpStatus),
  );
};
