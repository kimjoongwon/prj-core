import { Injectable } from '@nestjs/common';
import { InputBuilder } from '@shared/types';

@Injectable()
export class PasswordInput {
  build(): InputBuilder {
    const input: InputBuilder = {
      type: 'Input',
      path: 'form.inputs.password',
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
