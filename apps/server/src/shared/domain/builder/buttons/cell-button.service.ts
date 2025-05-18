import { Injectable } from '@nestjs/common';
import { ButtonBuilder } from '@shared/types';

@Injectable()
export class CellButtonService {
  getMeta(types: ('edit' | 'detail' | 'remove')[]) {
    const buttons = [];
    if (types.includes('edit')) {
      buttons.push(this.getEditButton());
    }
    if (types.includes('detail')) {
      buttons.push(this.getDetailButton());
    }
    if (types.includes('remove')) {
      buttons.push(this.getRemoveButton());
    }
    return buttons;
  }

  getEditButton() {
    const button: ButtonBuilder = {
      color: 'primary',
      name: '수정',
      navigator: {
        pathname: 'groups/:groupId/edit',
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
