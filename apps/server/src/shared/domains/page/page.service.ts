import { Injectable } from '@nestjs/common';
import { State } from '@shared/types';

@Injectable()
export class PageService {
  getPages() {
    const pages: State[] = [
      {
        layout: {
          type: 'Empty',
        },
        name: '루트',
        pathname: '/',
      },
      {
        layout: {
          type: 'Empty',
        },
        name: '어드민',
        pathname: '/admin',
      },
      {
        layout: {
          type: 'Auth',
          gridProps: {
            container: true,
            spacing: 2,
            justifyContent: 'center',
          },
        },
        name: '로그인',
        pathname: '/admin/auth/login',
        form: {
          name: '로그인',
          elements: [
            {
              type: 'Input',
              input: {
                value: 'galaxy@gmail.com',
                type: 'email',
                label: '이메일',
                placeholder: '이메일을 입력해주세요.',
                validator: {
                  validation: {
                    type: 'string',
                    timings: ['onBlur'],
                    required: true,
                    messages: {
                      required: '이메일을 입력해주세요.',
                    },
                    isValid: false,
                  },
                },
              },
              gridProps: {
                size: 10,
              },
            },
            {
              type: 'Input',
              input: {
                label: '비밀번호',
                type: 'password',
                placeholder: '비밀번호를 입력해주세요.',
                value: 'rkdmf12!@',
                validator: {
                  validation: {
                    type: 'string',
                    timings: ['onBlur'],
                    required: true,
                    messages: {
                      required: '비밀번호를 입력해주세요.',
                    },
                    isValid: false,
                  },
                },
              },
              gridProps: {
                size: 10,
              },
            },
            {
              type: 'Button',
              input: {
                color: 'primary',
                title: '로그인',
                fullWidth: true,
              },
              gridProps: {
                size: 10,
              },
            },
          ],
        },
      },
      {
        pathname: '/admin/main',
        layout: {
          type: 'Main',
        },
        name: '메인',
      },
    ];

    return pages;
  }
}
