import { Injectable } from '@nestjs/common';
import { InputBuilder } from '@shared/types';

@Injectable()
export class NameInput {
  getMeta() {
    const input: InputBuilder = {
      path: 'name',
      type: 'Input',
      props: {
        fullWidth: true,
        label: '이름',
        placeholder: '이름을 입력해주세요.',
      },
    };

    return input;
  }
}
