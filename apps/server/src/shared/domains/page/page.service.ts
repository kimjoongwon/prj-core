import { Injectable } from '@nestjs/common';
import { IPage } from '@shared/types';

interface Element {
  type: 'Input';
  path: string;
  placeholder: string;
  label: string;
  validation: {
    timing: 'onBlur' | 'onChange' | 'onClick';
    required: boolean;
    message: string;
  };
}

@Injectable()
export class PageService {
  getPages() {
    const pages: IPage[] = [
      {
        layout: {
          type: 'Empty',
        },
        name: '루트',
        state: {},
        pathname: '/',
      },
      {
        layout: {
          type: 'Empty',
        },
        name: '어드민',
        state: {},
        pathname: '/admin',
      },
      {
        layout: {
          type: 'Auth',
        },
        name: '로그인',
        state: {
          form: {
            email: 'galaxy@gmail.com',
            password: 'rkdmf12!@',
          },
        },
        pathname: '/admin/auth/login',
        form: {
          name: '로그인',
          button: {
            title: '로그인',
            color: 'primary',
            flow: {
              mutation: 'getToken',
              success: {
                message: '로그인 성공',
                pathname: '/admin/main',
              },
              failure: {
                message: '로그인 실패',
              },
            },
          },
          elements: [
            {
              type: 'Input',
              input: {
                type: 'email',
                label: '이메일',
                path: 'form.email',
                placeholder: '이메일을 입력해주세요.',
                validation: {
                  timing: 'onBlur',
                  required: true,
                  message: '이메일을 입력해주세요.',
                },
              },
            },
            {
              type: 'Input',
              input: {
                label: '비밀번호',
                type: 'password',
                placeholder: '비밀번호를 입력해주세요.',
                path: 'form.password',
                validation: {
                  timing: 'onBlur',
                  required: true,
                  message: '비밀번호를 입력해주세요.',
                },
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
        state: {},
      },
    ];

    return pages;
  }
}
