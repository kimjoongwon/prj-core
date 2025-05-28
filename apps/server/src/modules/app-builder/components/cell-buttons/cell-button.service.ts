import { Injectable } from '@nestjs/common';
import { ButtonBuilder } from '@shared/types';

@Injectable()
export class CellButtonService {
  getMeta(types: ('modify' | 'detail' | 'remove')[]) {
    const buttons = [];
    if (types.includes('modify')) {
      buttons.push(this.getModifyButton());
    }
    if (types.includes('detail')) {
      buttons.push(this.getDetailButton());
    }
    if (types.includes('remove')) {
      buttons.push(this.getRemoveButton());
    }
    return buttons;
  }

  getModifyButton() {
    const button: ButtonBuilder = {
      color: 'primary',
      name: '수정',
      navigator: {
        pathname: 'groups/:groupId/modify',
      },
    };

    return button;
  }

  getDetailButton() {
    const button: ButtonBuilder = {
      color: 'secondary',
      name: '상세',
      navigator: {
        pathname: 'groups/:groupId',
      },
    };

    return button;
  }

  getRemoveButton() {
    const button: ButtonBuilder = {
      color: 'danger',
      name: '삭제',
    };

    return button;
  }
}
