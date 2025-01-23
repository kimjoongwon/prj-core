import { Injectable } from '@nestjs/common';
import { RouteBuilder } from '@shared/types';

@Injectable()
export class TimelineNewEdit {
  constructor() {}

  getRoute(): RouteBuilder {
    return {
      name: '타임라인',
      pathname: 'new/edit',
      layout: {
        type: 'Modal',
        name: '새편집',
        page: {
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
                components: [
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
        },
      },
    };
  }
}
