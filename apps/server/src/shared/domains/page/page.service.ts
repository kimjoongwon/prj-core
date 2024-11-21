import { Injectable } from '@nestjs/common';
import { BButton, State } from '@shared/types';

@Injectable()
export class PageService {
  getPages() {
    const pages: State[] = [
      {
        layout: {
          type: 'Auth',
        },
        name: '메인',
        pathname: 'admin/main',
        payload: {},
      },
      {
        layout: {
          type: 'Auth',
        },
        name: '로그인',
        pathname: 'admin/auth/login',
        payload: {
          email: 'galaxy@gmail.com',
          password: 'rkdmf12!@',
        },
        forms: [
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
                props: {
                  path: 'payload.email',
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
                  isValid: false,
                },
                gridProps: {
                  size: 12,
                },
              },
              {
                type: 'Input',
                props: {
                  path: 'payload.password',
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
                  isValid: false,
                },
                gridProps: {
                  size: 12,
                },
              },
              {
                type: 'Button',
                props: {
                  color: 'primary',
                  fullWidth: true,
                  children: '로그인',
                  flow: {
                    mutation: 'getToken',
                    try: {
                      pathname: '/admin/main',
                      message: '로그인 성공',
                      severity: 'success',
                    },
                    catch: {
                      message: '로그인 실패',
                      pathname: '/admin/auth/login',
                      severity: 'error',
                    },
                  },
                } as BButton,
                gridProps: {
                  size: 12,
                },
              },
            ],
          },
        ],
      },
    ];

    return pages;
  }
}
