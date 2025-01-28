import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';
import { TenancyColumns } from '../columns/tenancy.columns';
import { CategoryColumns } from '../columns/category.columns';

@Injectable()
export class CategoriesPage {
  constructor(private readonly categoryColumns: CategoryColumns) {}

  getMeta(): PageBuilder {
    const page: PageBuilder = {
      name: '목록',
      type: 'Page',
      dataGrid: {
        table: {
          query: {
            name: 'useGetCategoriesByQuery',
            params: {
              serviceId: '',
              type: 'ROOT',
            },
            mapper: {
              serviceId: 'serviceId',
            },
          },
          columns: this.categoryColumns.getMeta(),
        },
        buttons: [
          {
            name: '생성',
            navigator: {
              pathname: 'categories/new/edit',
            },
          },
        ],
      },
    };

    return page;
  }
}
