import { Injectable } from '@nestjs/common';

interface Element {
  type: 'Input';
  path: string;
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
        name: '메인',
        state: {},
        pathname: '',
        elements: [],
        children: [
          {
            name: '로그인',
            pathname: 'auth/login',
            elements: [
              {
                type: 'Input',
                path: 'form.tokenDto.email',
                validation: {
                  timing: 'onBlur',
                  required: true,
                  message: '이메일을 입력해주세요.',
                },
              },
              {
                type: 'Input',
                path: 'form.tokenDto.password',
                validation: {
                  timing: 'onBlur',
                  required: true,
                  message: '비밀번호를 입력해주세요.',
                },
              },
            ],
            state: {
              form: {
                tokenDto: {
                  email: '',
                  password: '',
                },
              },
            },
          },
        ],
      },
    ];

    return pages;
  }
}
