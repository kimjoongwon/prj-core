import { type ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ResponseEntity } from '@shared/schema';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    super.catch(
      new HttpException(
        ResponseEntity.WITH_ERROR<object | string>(
          exception?.getStatus?.(),
          exception.message,
          typeof exception?.getResponse?.() === 'object' ? exception.getResponse() : null
        ),
        exception?.getStatus?.()
      ),
      host
    );
  }
}
