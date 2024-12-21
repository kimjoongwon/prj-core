import { PageBuilder } from '@shared/types';

export const loginPage: PageBuilder = {
  name: '로그인',
  form: {
    state: {
      body: {
        email: '',
        password: '',
      },
    },
    isInValid: false,
    name: '로그인',
    button: {
      name: '로그인',
      mutation: { name: 'getToken' },
      success: {
        message: '로그인 성공',
        link: '/admin/main/services',
      },
      failure: {
        message: '로그인 실패',
        link: '/admin/auth/login',
      },
    },
    sections: [
      {
        gridProps: {
          container: true,
          spacing: 2,
          justifyContent: 'center',
        },
        name: '로그인',
        components: [
          {
            type: 'Input',
            path: 'body.email',
            props: {
              type: 'email',
              label: '이메일',
              placeholder: '이메일을 입력해주세요.',
            },
            validation: {
              type: 'string',
              timings: ['onChange'],
              required: true,
              messages: {
                required: '이메일을 입력해주세요.',
              },
              errorMessage: '',
              isInvalid: false,
            },
            gridProps: {
              size: 12,
            },
          },
          {
            type: 'Input',
            path: 'body.password',
            props: {
              label: '비밀번호',
              type: 'password',
              placeholder: '비밀번호를 입력해주세요.',
            },
            validation: {
              type: 'string',
              timings: ['onBlur'],
              required: true,
              messages: {
                required: '비밀번호를 입력해주세요.',
              },
              errorMessage: '',
              isInvalid: false,
            },
            gridProps: {
              size: 12,
            },
          },
        ],
      },
    ],
  },
};
