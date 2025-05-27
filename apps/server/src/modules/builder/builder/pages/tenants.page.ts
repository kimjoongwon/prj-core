import { PageBuilder } from '@shared/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantsPage {
  getMeta(): PageBuilder {
    const page: PageBuilder = {
      type: 'Page',
      name: '공간',
    };

    return page;
  }
}
