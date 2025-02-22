import { ColumnBuilder } from '@shared/types';
import { ContextProvider } from '../../../providers/context.provider';

export class ActionColumns {
  getMeta() {
    const tenancyId = ContextProvider.getTenancyId();
    const serviceId = ContextProvider.getServiceId();

    const columns: ColumnBuilder[] = [
      {
        id: 'action',
        header: {
          name: '액션',
        },
        cell: {
          buttons: [
            {
              icon: 'detail',
              color: 'primary',
              name: '상세',
              navigator: {
                pathname: `/admin/main/tenancies/${tenancyId}/services/${serviceId}/:rowId`,
              },
            },
            {
              icon: 'add',
              color: 'secondary',
              name: '추가',
              navigator: {
                pathname: `categories/:rowId/add`,
              },
            },
            {
              icon: 'edit',
              color: 'warning',
              name: '수정',
              navigator: {
                pathname: `exercises/:rowId/edit`,
              },
            },
            {
              icon: 'delete',
              color: 'danger',
              name: '삭제',
              mutation: {
                name: 'deleteCategory',
              },
            },
          ],
        },
      },
    ];

    return columns;
  }
}
