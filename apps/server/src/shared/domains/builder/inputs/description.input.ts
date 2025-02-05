import { Injectable } from '@nestjs/common';
import { InputBuilder } from '@shared/types';

@Injectable()
export class DescriptionInput {
  getLabel() {
    return '설명';
  }

  getMeta() {
    const input: InputBuilder = {
      path: 'form.input.description',
      type: 'Input',
      props: {
        label: this.getLabel(),
        placeholder: `${this.getLabel()}을 입력해주세요.`,
      },
      validation: {
        type: 'string',
        timings: ['onChange'],
        required: true,
        messages: {
          required: `${this.getLabel()}을 입력해주세요.`,
        },
        errorMessage: '',
        isInvalid: false,
      },
    };

    return input;
  }
}
