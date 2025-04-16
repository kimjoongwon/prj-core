import { Injectable } from '@nestjs/common';
import { ButtonBuilder } from '@shared/types';

@Injectable()
export class ButtonBuilderService {
  build({ name, mutation }: ButtonBuilder): ButtonBuilder {
    return {
      name,
      mutation,
      toast: {
        title: '성공',
        description: '성공적으로 처리되었습니다.',
      },
      navigator: {
        type: 'back',
      },
    };
  }
}
