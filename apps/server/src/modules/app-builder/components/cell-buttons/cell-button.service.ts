import { Injectable } from '@nestjs/common';
import { ButtonBuilder } from '@shared/types';

@Injectable()
export class CellButtonService {
  build(types: ('modify' | 'detail' | 'remove')[]) {
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
        route: { relativePath: ':id/modify' },
      },
    };
    return button;
  }
  getDetailButton() {
    const button: ButtonBuilder = {
      name: '상세',
      navigator: {
        route: {
          name: '그라운드',
          relativePath: ':id',
        },
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
