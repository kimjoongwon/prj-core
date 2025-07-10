import {
  type ArgumentMetadata,
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ParseContentPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value.content && typeof value.content === 'string') {
      try {
        value.content = JSON.parse(value.content);
      } catch (error) {
        throw new BadRequestException('Invalid JSON in content field');
      }
    }

    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return value;
  }
}
