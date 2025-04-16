import { Injectable } from '@nestjs/common';
import { ButtonBuilder, ColumnBuilder } from '@shared/types';
import { upperFirst } from 'lodash';
import Pluaralize from 'pluralize';

type CellButton = 'edit' | 'detail' | 'remove' | 'add';
type CellColumn = 'name' | 'label';

@Injectable()
export class ColumnBuilderService {
  private cellButtons: CellButton[] = [];
  private cellColumns: CellColumn[] = [];
  private resourceName: string;

  public build(
    resourceName: string,
    cellColumns: CellColumn[] = this.cellColumns,
    cellButtons: CellButton[] = this.cellButtons,
  ): ColumnBuilder[] {
    this.resourceName = resourceName;

    const columns: ColumnBuilder[] = [];

    if (cellColumns.includes('name')) {
      columns.push(this.createNameColumn());
    }

    if (cellColumns.includes('label')) {
      columns.push(this.createLabelColumn());
    }

    if (cellButtons.length > 0) {
      columns.push(this.createActionColumn(cellButtons));
    }

    return columns;
  }

  private createActionColumn(cellButtons: CellButton[]): ColumnBuilder {
    return {
      id: 'action',
      header: { name: '액션' },
      cell: { buttons: this.getCellButtons(cellButtons) },
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
  private getCellButtons(cellButtons: CellButton[]): ButtonBuilder[] {
    return cellButtons
      .map((buttonType) => this.createButton(buttonType))
      .filter(Boolean) as ButtonBuilder[];
  }

  private createButton(buttonType: CellButton): ButtonBuilder | null {
    const buttonCreators: Record<CellButton, () => ButtonBuilder> = {
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
