import { Injectable } from '@nestjs/common';
import { PageBuilder } from '@shared/types';

@Injectable()
export class TimelineEditPage {
  constructor() {}

  getMeta(timelineId: string | 'new', type: 'edit' | 'add') {
    const page: PageBuilder = {
      state: {
        form: {
          data: {
            name: '',
          },
        },
        dataGrid: {
          selectedRowIds: [],
        },
      },
      name: '새편집',
      form: {
        button: {
          mutation: {
            name: 'createTimeline',
            mapper: {
              selectedRowIds: 'sessionIds',
            },
          },
          navigator: {
            pathname: '..',
          },
          name: '저장',
        },
        sections: [
          {
            name: '기본정보',
            stacks: [
              {
                type: 'VStack',
                inputs: [
                  {
                    type: 'Input',
                    path: 'name',
                    props: {
                      label: '타임라인명',
                      placeholder: '타임라인명을 입력하세요',
                    },
                  },
                  {
                    type: 'DataGridBuilder',
                    props: {
                      dataGridBuilder: {
                        table: {
                          selectionMode: 'multiple',
                          query: {
                            name: 'useGetSessionsByQuery',
                            params: {
                              timelineId: undefined,
                            },
                          },
                          columns: [
                            {
                              accessorKey: 'name',
                              header: {
                                name: '이름',
                              },
                            },
                            {
                              accessorKey: 'type',
                              header: {
                                name: '유형',
                              },
                            },
                            {
                              accessorKey: 'startDateTime',
                              header: {
                                name: '시작일',
                              },
                              cell: {
                                type: 'dateTime',
                              },
                            },
                            {
                              accessorKey: 'endDateTime',
                              header: {
                                name: '종료일',
                              },
                              cell: {
                                type: 'dateTime',
                              },
                            },
                          ],
                        },
                      } as any,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    if (timelineId !== 'new' && type === 'edit') {
      page.form.button.mutation.name = 'updateTimeline';
      page.form.button.mutation.id = timelineId;
    }

    return page;
  }
}
