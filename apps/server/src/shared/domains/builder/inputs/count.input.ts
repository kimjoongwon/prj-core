import { Injectable } from '@nestjs/common';
import { InputBuilder } from '@shared/types';

@Injectable()
export class CountInput {
  getMeta(): InputBuilder {
    return {
      type: 'Input',
      path: 'count',
      props: {
        type: 'number',
        label: '개수',
        placeholder: '개수을 입력해주세요.',
      },
      validation: {
        type: 'string',
        timings: ['onChange'],
        errorMessages: {
          required: '이메일을 입력해주세요.',
        },
        conditions: {
          required: true,
        },
      },
    };
  }
}
