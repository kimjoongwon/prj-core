import { Injectable } from '@nestjs/common';
import { InputBuilder } from '@shared/types';

@Injectable()
export class TitleInput {
  getMeta() {
    const input: InputBuilder = {
      path: 'form.inputs.title',
      type: 'Input',
      props: {
        label: '제목',
        placeholder: '제목을 입력해주세요.',
      },
      validation: {
        type: 'string',
        timings: ['onChange'],
        errorMessages: {
          required: '제목을 입력해주세요.',
        },
        required: true,
      },
    };

    return input;
  }
}
