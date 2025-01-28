import { PageBuilder } from '@shared/types';

export const groupEditPage: PageBuilder = {
  name: '그룹',
  type: 'Page',
  query: {
    name: 'useGetGroup',
    idMapper: 'groupId',
  },
  state: {
    form: {
      data: {
        name: '',
        serviceId: '',
      },
    },
  },
  form: {
    name: '정보',
    button: {
      name: '저장',
      mutation: {
        name: 'updateGroup',
        idMapper: 'groupId',
        mapper: {
          serviceId: 'serviceId',
        },
      },
      alert: {
        message: '!!!',
      },
      navigator: {
        pathname: '..',
      },
    },
    sections: [
      {
        name: '그룹 정보',
        stacks: [
          {
            type: 'VStack',
            inputs: [
              {
                type: 'Input',
                path: 'name',
                props: {
                  fullWidth: true,
                  label: '그룹 이름',
                  placeholder: '그룹 이름을 입력해주세요.',
                },
              },
            ],
          },
        ],
      },
    ],
  },
};
