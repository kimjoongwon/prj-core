import { Injectable } from '@nestjs/common';
import { ElementBuilder } from '@shared/types';

@Injectable()
export class EmailInput {
  build(): ElementBuilder {
    return {
      name: 'Input',
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
