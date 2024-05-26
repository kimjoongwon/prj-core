import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseEntity } from '../entities';

export const ApiResponseEntity = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  options?: { isArray?: boolean },
) => {
  const properties = {
    statusCode: { type: 'string', nullable: false },
    message: { type: 'string', nullable: false },
    data: { $ref: getSchemaPath(dataDto) },
  };
  const allOf = options?.isArray
    ? [
        { $ref: getSchemaPath(ResponseEntity) },
        {
          properties: {
            statusCode: { type: 'string', nullable: false },
            message: { type: 'string', nullable: false },
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(dataDto) },
            },
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
    ApiOkResponse({
      schema: {
        allOf,
      },
    }),
  );
};
