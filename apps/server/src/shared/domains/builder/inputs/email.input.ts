import { Injectable } from '@nestjs/common';
import { InputBuilder } from '@shared/types';

@Injectable()
export class EmailInput {
  getMeta(): InputBuilder {
    return {
      type: 'Input',
      path: 'email',
      props: {
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
        errorMessage: '',
        isInvalid: false,
      },
      gridProps: {
        size: 12,
      },
    };
  }
}
