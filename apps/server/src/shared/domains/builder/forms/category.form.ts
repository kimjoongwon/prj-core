import { Injectable } from '@nestjs/common';
import { FormBuilder } from '@shared/types';
import { NameInput } from '../inputs/name.input';

@Injectable()
export class CategoryForm {
  constructor(private readonly nameInput: NameInput) {}

  getMeta() {
    const nameInput = this.nameInput.getMeta();
    const form: FormBuilder = {
      name: '정보',
      button: {
        name: '저장',
        mutation: {
          name: 'createCategory',
          payloadPath: 'form',
        },
        alert: {
          message: '!!!',
        },
        navigator: {
          pathname: '..',
        },
      },
      sections: [
        {
          name: '카테고리 정보',
          stacks: [
            {
              type: 'VStack',
              inputs: [nameInput],
            },
          ],
        },
      ],
    };

    return form;
  }
}
