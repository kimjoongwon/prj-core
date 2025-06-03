import { Injectable } from '@nestjs/common';
import { ElementBuilder, ElementName } from '@shared/types';

@Injectable()
export class TextInput {
  getLabel() {
    return '내용';
  }

  getMeta(name: ElementName, path: string = 'form.elements.content.text') {
    const input: ElementBuilder = {
      path,
      name,
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
