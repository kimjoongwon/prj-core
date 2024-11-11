import { Injectable } from '@nestjs/common';
import { children } from 'effect/Fiber';

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

interface IPage {
  name: string;
  pathname: string;
  children?: IPage[];
  elements: Element[];
  state: any;
}

@Injectable()
export class PageService {
  getPages() {
    const pages = [
      {
        layout: {
          type: 'Empty',
        },
        name: '루트',
        state: {},
        pathname: '/',
        elements: [],
      },
      {
        layout: {
          type: 'Empty',
        },
        name: '어드민',
        state: {},
        pathname: '/admin',
        elements: [],
      },
      {
        layout: {
          type: 'Auth',
        },
        name: '로그인',
        state: {
          form: {
            email: '',
            password: '',
          },
        },
        pathname: '/admin/auth/login',
        form: {
          name: '로그인',
          submit: {
            button: {
              title: '로그인',
              mutation: 'getToken',
              onSuccess: {
                navigate: {
                  pathname: '/admin/main',
                },
              },
            },
          },
          elements: [
            {
              label: '이메일',
              type: 'Input',
              placeholder: '이메일을 입력해주세요.',
              path: 'form.email',
              validation: {
                timing: 'onBlur',
                required: true,
                message: '이메일을 입력해주세요.',
              },
            },
            {
              label: '비밀번호',
              type: 'Input',
              placeholder: '비밀번호를 입력해주세요.',
              path: 'form.password',
              validation: {
                timing: 'onBlur',
                required: true,
                message: '비밀번호를 입력해주세요.',
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
        elements: [],
      },
    ];

    return pages;
  }
}
