import { Injectable } from '@nestjs/common';
import { InputBuilder } from '@shared/types';

@Injectable()
export class PasswordInput {
  getMeta(): InputBuilder {
    const input: InputBuilder = {
      type: 'Input',
      path: 'form.inputs.password',
      props: {
        label: '비밀번호',
        type: 'password',
        placeholder: '비밀번호를 입력해주세요.',
      },
      validation: {
        type: 'string',
        timings: ['onBlur'],
        errorMessages: {
          required: '비밀번호를 입력해주세요.',
        },
        required: true,
      },
    };

    return input;
  }
}
