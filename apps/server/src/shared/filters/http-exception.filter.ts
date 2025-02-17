import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import {
  // Request,
  Response,
} from 'express';
import { ResponseEntity } from '../entities';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const responseEntity = ResponseEntity.WITH_ERROR(status, exception.message);

    response.status(status).json(responseEntity);
  }
}
