import { Injectable } from '@nestjs/common';
import { ElementBuilder } from '@shared/specs';

@Injectable()
export class NameInput {
  getMeta() {
    const input: ElementBuilder = {
      path: 'form.elements.name',
      name: 'Input',
      props: {
        fullWidth: true,
        label: '이름',
        placeholder: '이름을 입력해주세요.',
      },
    };

    return input;
  }
}
