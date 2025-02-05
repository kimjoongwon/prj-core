import { Injectable } from '@nestjs/common';
import { InputBuilder } from '@shared/types';

@Injectable()
export class LabelInput {
  getMeta() {
    const input: InputBuilder = {
      path: 'form.name',
      type: 'Input',
      props: {
        fullWidth: true,
        label: '라벨',
        placeholder: '라벨을 입력해주세요.',
      },
    };

    return input;
  }
}
