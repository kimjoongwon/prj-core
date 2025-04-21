import { Injectable } from '@nestjs/common';
import { ButtonBuilder, ColumnBuilder } from '@shared/types';
import { upperFirst } from 'lodash';
import Pluaralize from 'pluralize';

export type CellActionName = 'edit' | 'detail' | 'remove' | 'add';
export type ColumnName = 'name' | 'label';

@Injectable()
export class ColumnBuilderService {
  private cellActionNames: CellActionName[] = [];
  private columnName: ColumnName[] = [];
  private resourceName: string;

  public build(
    resourceName: string,
    columnName: ColumnName[] = this.columnName,
    cellActionNames: CellActionName[] = this.cellActionNames,
  ): ColumnBuilder[] {
    this.resourceName = resourceName;

    const columns: ColumnBuilder[] = [];

    if (columnName.includes('name')) {
      columns.push(this.createNameColumn());
    }

    if (columnName.includes('label')) {
      columns.push(this.createLabelColumn());
    }

    if (cellActionNames.length > 0) {
      columns.push(this.createActionColumn(cellActionNames));
    }

    return columns;
  }

  private createActionColumn(cellActionNames: CellActionName[]): ColumnBuilder {
    return {
      id: 'action',
      header: { name: '액션' },
      cell: { buttons: this.getCellActionNames(cellActionNames) },
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
  private getCellActionNames(cellActionNames: CellActionName[]): ButtonBuilder[] {
    return cellActionNames
      .map((buttonType) => this.createButton(buttonType))
      .filter(Boolean) as ButtonBuilder[];
  }

  private createButton(buttonType: CellActionName): ButtonBuilder | null {
    const buttonCreators: Record<CellActionName, () => ButtonBuilder> = {
      edit: this.getEditButton.bind(this),
      detail: this.getDetailButton.bind(this),
      remove: this.getRemoveButton.bind(this),
      add: this.getAddButton.bind(this),
    };

    return buttonCreators[buttonType]?.();
  }

  private getEditButton(): ButtonBuilder {
    return {
      color: 'secondary',
      name: '수정',
      navigator: {
        type: 'push',
        pathname: ':rowId/edit',
      },
    };
  }

  private getDetailButton(): ButtonBuilder {
    return {
      color: 'primary',
      name: '상세',
      navigator: {
        type: 'push',
        pathname: ':rowId/detail',
      },
    };
  }

  private getRemoveButton(): ButtonBuilder {
    return {
      color: 'danger',
      name: '삭제',
      mutation: {
        name: `delete${upperFirst(this.resourceName)}`,
        invalidationKey: `/api/v1/${Pluaralize(this.resourceName || '')}`,
      },
    };
  }

  private getAddButton(): ButtonBuilder {
    return {
      color: 'success',
      name: '추가',
      navigator: {
        type: 'push',
        pathname: ':rowId/add',
      },
    };
  }
}
