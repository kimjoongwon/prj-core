import { Injectable } from '@nestjs/common';
import { InputBuilder } from '@shared/types';

@Injectable()
export class PasswordInputBuilder {
  getMeta(): InputBuilder {
    const input: InputBuilder = {
      type: 'Input',
      path: 'password',
      props: {
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
    };

    return input;
  }
}
