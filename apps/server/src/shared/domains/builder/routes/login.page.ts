import { PageBuilder } from '@shared/frontend';

export const loginPage: PageBuilder = {
  name: '로그인',
  form: {
    isInValid: false,
    name: '로그인',
    button: {
      color: 'primary',
      fullWidth: true,
      children: '로그인',
      flow: {
        finally: {
          message: '로그인 시도가 종료되었습니다.',
        },
        mutation: 'getToken',
        try: {
          pathname: '/admin/main/services',
          message: '로그인 성공',
          severity: 'success',
        },
        catch: {
          message: '로그인 실패',
          pathname: '/admin/auth/login',
          severity: 'error',
        },
      },
    },
    sections: [
      {
        payload: {
          data: {
            email: '',
            password: '',
          },
        },
        gridProps: {
          container: true,
          spacing: 2,
          justifyContent: 'center',
        },
        name: '로그인',
        components: [
          {
            type: 'Input',
            path: 'email',
            props: {
              value: 'galaxy@gmail.com',
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
            path: 'password',
            props: {
              value: 'rkdmf12!@',
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
