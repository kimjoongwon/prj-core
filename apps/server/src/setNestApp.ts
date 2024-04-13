import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomClassSerializerInterceptor } from '@shared/backend';

export function setNestApp<T extends INestApplication>(app: T): void {
  app.useGlobalInterceptors(
    new CustomClassSerializerInterceptor(app.get(Reflector)),
  );
}
