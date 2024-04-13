import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseEntity } from '../entity/response.entity';

export const ApiResponseEntity = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(ResponseEntity, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseEntity) },
          {
            properties: {
              statusCode: { type: 'string', nullable: false },
              message: { type: 'string', nullable: false },
              data: { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      },
    }),
  );
