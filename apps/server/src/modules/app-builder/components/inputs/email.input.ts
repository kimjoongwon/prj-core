import { Injectable } from '@nestjs/common';
import { InputBuilder } from '@shared/types';

@Injectable()
export class EmailInput {
  build(): InputBuilder {
    return {
      type: 'Input',
      path: 'email',
      props: {
        type: 'email',
        label: '이메일',
        placeholder: '이메일을 입력해주세요.',
      },
      validation: {
        timings: ['onChange'],
        required: {
          value: true,
          message: '이메일을 입력해주세요.',
        },
      },
    };
  }
}
