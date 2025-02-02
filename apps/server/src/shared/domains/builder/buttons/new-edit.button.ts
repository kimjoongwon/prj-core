import { Injectable } from '@nestjs/common';
import { ButtonBuilder } from '@shared/types';

@Injectable()
export class NewEditButton {
  getMeta(service: string) {
    const button: ButtonBuilder = {
      name: '생성',
      navigator: {
        pathname: `${service}/new/edit`,
      },
    };

    return button;
  }
}
