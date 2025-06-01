import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { ElementBuilder } from '@shared/specs';

@Injectable()
export class TextInput {
  getLabel() {
    return '내용';
  }

  getMeta(type: $Enums.TextTypes = 'Textarea', path: string = 'form.elements.content.text') {
    const input: ElementBuilder = {
      path,
      name: type,
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
