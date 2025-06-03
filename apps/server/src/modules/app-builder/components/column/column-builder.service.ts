import { Injectable } from '@nestjs/common';
import { ButtonBuilder, ColumnBuilder } from '@shared/types';
import { upperFirst } from 'lodash';
import Pluaralize from 'pluralize';

export type CellActionName = 'modify' | 'detail' | 'remove' | 'create';
export type ColumnName = 'name' | 'label';

@Injectable()
export class ColumnBuilderService {
  private resourceName: string;
  public build(
    resourceName: string,
    accessorKeys: string[],
    cellActionNames: CellActionName[],
  ): ColumnBuilder[] {
    this.resourceName = resourceName;
    const columns: ColumnBuilder[] = accessorKeys.map((accessorKey) => {
      return this.createColumn(accessorKey);
    });

    if (cellActionNames.length > 0) {
      columns.push(this.createActionColumn(cellActionNames));
    }

    return columns;
  }

  private convertKeyToKorean(key: string): string {
    const keyMap: Record<string, string> = {
      name: '이름',
      label: '라벨',
      businessNo: '사업자번호',
      address: '주소',
      phone: '전화번호',
      email: '이메일',
      // Add more key mappings as needed
    };
    return keyMap[key] || key;
  }

  private createColumn(accessorKey: string) {
    const rawAccessorKey = accessorKey.split('.').pop() || '';
    return {
      accessorKey,
      header: { name: this.convertKeyToKorean(rawAccessorKey) },
      cell: {
        expandable: true,
      },
    };
  }

  private createActionColumn(cellActionNames: CellActionName[]): ColumnBuilder {
    return {
      id: 'action',
      header: { name: '액션' },
      cell: { buttons: [] },
    };
  }

  private createNameColumn(): ColumnBuilder {
    return {
      accessorKey: 'name',
      header: { name: '이름' },
      cell: {
        expandable: true,
      },
    };
  }
  private createLabelColumn(): ColumnBuilder {
    return {
      accessorKey: 'label',
      header: { name: '라벨' },
    };
  }
  // private getCellActionNames(cellActionNames: CellActionName[]): ButtonBuilder[] {
  //   return cellActionNames
  //     .map((buttonType) => this.createButton(buttonType))
  //     .filter(Boolean) as ButtonBuilder[];
  // }

  // private createButton(buttonType: CellActionName): ButtonBuilder | null {
  //   const buttonCreators: Record<CellActionName, () => ButtonBuilder> = {
  //     modify: this.getModifyButton.bind(this),
  //     detail: this.getDetailButton.bind(this),
  //     remove: this.getRemoveButton.bind(this),
  //     create: this.getCreateButton.bind(this),
  //   };

  //   return buttonCreators[buttonType]?.();
  // }

  // private getModifyButton(): ButtonBuilder {
  //   return {
  //     color: 'secondary',
  //     name: '수정',
  //     // navigator: {
  //     //   type: 'push',
  //     //   pathname: ':rowId/modify',
  //     // },
  //   };
  // }

  // private getDetailButton(): ButtonBuilder {
  //   return {
  //     color: 'primary',
  //     name: '상세',
  //     // navigator: {
  //     //   type: 'push',
  //     //   pathname: ':rowId/detail',
  //     // },
  //   };
  // }

  // private getRemoveButton(): ButtonBuilder {
  //   return {
  //     color: 'danger',
  //     name: '삭제',
  //     // mutation: {
  //     //   name: `delete${upperFirst(this.resourceName)}`,
  //     //   invalidationKey: `/api/v1/${Pluaralize(this.resourceName || '')}`,
  //     // },
  //   };
  // }

  // private getCreateButton(): ButtonBuilder {
  //   return {
  //     color: 'success',
  //     name: '추가',
  //     // navigator: {
  //     //   type: 'push',
  //     //   pathname: ':rowId/create',
  //     // },
  //   };
  // }
}
