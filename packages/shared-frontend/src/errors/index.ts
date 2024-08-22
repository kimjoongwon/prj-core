import { AxiosError } from 'axios';

export class InvalidPasswordError {
  readonly _tag = 'InvalidPasswordError';
}

export class GalaxyError<D> extends AxiosError<unknown, D> {
  readonly _tag = 'GalaxyError';
}
