import { Injectable } from '@nestjs/common';
import { ElementBuilder } from '@shared/types';

@Injectable()
export class LabelInput {
  getMeta() {
    const input: ElementBuilder = {
      path: 'form.elements.name',
      name: 'Input',
      props: {
        fullWidth: true,
        label: '라벨',
        placeholder: '라벨을 입력해주세요.',
      },
    };

    return input;
  }
}
