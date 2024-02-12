import { Reflector } from '@nestjs/core';

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Roles = Reflector.createDecorator<string[]>();
