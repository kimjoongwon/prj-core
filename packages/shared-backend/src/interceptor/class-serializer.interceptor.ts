import {
  Injectable,
  ClassSerializerInterceptor,
  PlainLiteralObject,
  ClassSerializerContextOptions,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { ResponseEntity } from '../entity';

@Injectable()
export class CustomClassSerializerInterceptor extends ClassSerializerInterceptor {
  serialize(response, options): PlainLiteralObject | PlainLiteralObject[] {
    const isArray = Array.isArray(response);
    const isObject = response !== null && typeof response === 'object';
    if (!isArray && !isObject) {
      return response;
    }
    console.log('response', response);
    return isArray
      ? response.map(res => this.transformToPlain(res, options))
      : this.transformToPlain(response, options);
  }

  transformToPlain(
    plainOrClass: any,
    options: ClassSerializerContextOptions,
  ): PlainLiteralObject {
    return plainOrClass ? classToPlain(plainOrClass, options) : plainOrClass;
  }
}
