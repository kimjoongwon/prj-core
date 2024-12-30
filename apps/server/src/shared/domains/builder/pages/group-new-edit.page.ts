import { PageBuilder } from '@shared/types';

export const groupNewEditPage: PageBuilder = {
  name: '그룹',
  type: 'Page',
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
        name: 'createGroup',
        hasPayload: true,
        hasServiceId: true,
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
