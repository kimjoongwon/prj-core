import { PageBuilder } from '@shared/types';

export class TimelinesPage {
  getMeta() {
    const page: PageBuilder = {
      type: 'Page',
      name: '목록',
      state: {
        form: {
          data: {
            categoryId: '',
            tenantId: '',
            timelineName: '',
          },
        },
      },
      dataGrid: {
        buttons: [
          {
            name: '추가',
            navigator: {
              pathname: 'timelines/new/edit',
            },
          },
        ],
        table: {
          query: {
            name: 'useGetTimelinesByQuery',
          },
          columns: [
            {
              accessorKey: 'name',
              header: {
                name: '이름',
              },
            },
            {
              id: 'actions',
              header: {
                name: '액션',
              },
              cell: {
                buttons: [
                  {
                    name: '상세',
                    color: 'primary',
                    navigator: {
                      pathname: 'timelines/:timelineId',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    };

    return page;
  }
}
