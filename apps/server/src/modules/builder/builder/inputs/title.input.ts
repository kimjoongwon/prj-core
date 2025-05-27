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
        timings: ['onChange'],
        required: {
          value: true,
          message: '제목을 입력해주세요.',
        },
      },
    };

    return input;
  }
}
