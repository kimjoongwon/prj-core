import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';
import { CategoryColumns } from '../columns/category.columns';
import { ActionColumns } from '../columns/action.columns';
import { ContextProvider } from '../../../providers/context.provider';

@Injectable()
export class CategoriesPage {
  constructor(
    private readonly categoryColumns: CategoryColumns,
    private readonly actionColumns: ActionColumns,
  ) {}

  getMeta(): PageBuilder {
    const serviceId = ContextProvider.getServiceId();
    const tenancyId = ContextProvider.getTenancyId();
    const categoryColumns = this.categoryColumns.getMeta();
    const actionColumns = this.actionColumns.getMeta();
    const columns = categoryColumns.concat(actionColumns);

    const page: PageBuilder = {
      name: '목록',
      type: 'Page',
      dataGrid: {
        table: {
          query: {
            name: 'useGetCategoriesByQuery',
            params: {
              serviceId,
              tenancyId,
              type: 'ROOT',
            },
          },
          columns,
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
