import { Injectable } from '@nestjs/common';
import { InputBuilder } from '@shared/types';

@Injectable()
export class DescriptionInput {
  getLabel() {
    return '설명';
  }

  getMeta() {
    const input: InputBuilder = {
      path: 'description',
      type: 'Input',
      props: {
        label: this.getLabel(),
        placeholder: `${this.getLabel()}을 입력해주세요.`,
      },
      validation: {
        timings: ['onChange'],
        required: {
          value: true,
          message: `${this.getLabel()}을 입력해주세요.`,
        },
      },
    };

    return input;
  }
}
