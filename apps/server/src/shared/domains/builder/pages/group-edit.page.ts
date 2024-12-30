import { PageBuilder } from '@shared/types';

export const groupEditPage: PageBuilder = {
  name: '그룹',
  type: 'Page',
  query: {
    name: 'useGetGroup',
    hasResourceId: true,
    hasParams: true,
  },
  form: {
    name: '정보',
    state: {
      payload: {
        name: '',
        serviceId: '',
      },
    },
    button: {
      name: '저장',
      mutation: {
        name: 'updateGroup',
        hasResourceId: true,
        hasPayload: true,
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
        components: [
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
};
