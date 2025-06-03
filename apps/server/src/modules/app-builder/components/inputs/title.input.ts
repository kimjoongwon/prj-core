import { Injectable } from '@nestjs/common';
import { ElementBuilder } from '@shared/types';

@Injectable()
export class TitleInput {
  getMeta() {
    const input: ElementBuilder = {
      path: 'form.elements.title',
      name: 'Input',
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
