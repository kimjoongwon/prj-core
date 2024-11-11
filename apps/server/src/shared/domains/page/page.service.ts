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
            email: '',
            password: '',
          },
        },
        pathname: '/admin/auth/login',
        form: {
          name: '로그인',
          submitButton: {
            title: '로그인',
            mutationKey: 'getToken',
            onSuccess: {
              navigate: {
                pathname: '/admin/main',
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
      },
    ];

    return pages;
  }
}
