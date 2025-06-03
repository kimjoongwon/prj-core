import { Injectable } from '@nestjs/common';
import { ElementBuilder } from '@shared/types';

@Injectable()
export class PasswordInput {
  build(): ElementBuilder {
    const input: ElementBuilder = {
      name: 'Input',
      path: 'form.elements.password',
      props: {
        label: '비밀번호',
        type: 'password',
        placeholder: '비밀번호를 입력해주세요.',
      },
      validation: {
        timings: ['onBlur'],
        required: {
          value: true,
          message: '비밀번호을 입력해주세요.',
        },
      },
    };

    return input;
  }
}
