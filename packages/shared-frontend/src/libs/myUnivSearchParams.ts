import { URLSearchParams } from 'url';

export class MyUnivSearchParams extends URLSearchParams {
  constructor(init?: string | URLSearchParams) {
    super(init);
  }

  getQueryString(key: string, value: unknown) {
    this.set(key, String(value));
    return this.toString() || '';
  }
}
