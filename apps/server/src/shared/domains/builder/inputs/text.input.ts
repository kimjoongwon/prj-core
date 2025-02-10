import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { InputBuilder } from '@shared/types';

@Injectable()
export class TextInput {
  getLabel() {
    return '내용';
  }

  getMeta(type: $Enums.TextTypes = 'Textarea', path: string = 'form.inputs.content.text') {
    const input: InputBuilder = {
      path,
      type,
      props: {
        label: this.getLabel(),
        placeholder: `${this.getLabel()}을 입력해주세요.`,
      },
      validation: {
        type: 'string',
        timings: ['onChange'],
        errorMessages: {
          required: `${this.getLabel()}을 입력해주세요.`,
        },
        required: true,
      },
    };

    return input;
  }
}
