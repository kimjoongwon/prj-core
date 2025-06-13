// import { Injectable } from '@nestjs/common';
// import { ColumnBuilder, IButtonBuilder } from '@shared/types';
// export type CellActionName = 'modify' | 'detail' | 'remove' | 'create';
// export type ColumnName = 'name' | 'label';

// @Injectable()
// export class ColumnBuilderService {
//   public build(
//     resourceName: string,
//     accessorKeys: string[],
//     cellActionNames: CellActionName[],
//   ): ColumnBuilder[] {
//     const columns: ColumnBuilder[] = accessorKeys.map((accessorKey) => {
//       return this.createColumn(accessorKey);
//     });

//     if (cellActionNames.length > 0) {
//       columns.push(this.createActionColumn(cellActionNames));
//     }

//     return columns;
//   }

//   private convertKeyToKorean(key: string): string {
//     const keyMap: Record<string, string> = {
//       name: '이름',
//       label: '라벨',
//       businessNo: '사업자번호',
//       address: '주소',
//       phone: '전화번호',
//       email: '이메일',
//       // Add more key mappings as needed
//     };
//     return keyMap[key] || key;
//   }

//   private createColumn(accessorKey: string) {
//     const rawAccessorKey = accessorKey.split('.').pop() || '';
//     return {
//       accessorKey,
//       header: { name: this.convertKeyToKorean(rawAccessorKey) },
//       cell: {
//         expandable: true,
//       },
//     };
//   }

//   private createActionColumn(cellActionNames: CellActionName[]): ColumnBuilder {
//     return {
//       id: 'action',
//       header: { name: '액션' },
//       cell: { buttons: this.getCellActionNames(cellActionNames) },
//     };
//   }

//   private createNameColumn(): ColumnBuilder {
//     return {
//       accessorKey: 'name',
//       header: { name: '이름' },
//       cell: {
//         expandable: true,
//       },
//     };
//   }

//   private createLabelColumn(): ColumnBuilder {
//     return {
//       accessorKey: 'label',
//       header: { name: '라벨' },
//     };
//   }

//   private getCellActionNames(cellActionNames: CellActionName[]): IButtonBuilder[] {
//     return cellActionNames
//       .map((buttonType) => this.createButton(buttonType))
//       .filter(Boolean) as IButtonBuilder[];
//   }

//   private createButton(buttonType: CellActionName): IButtonBuilder | null {
//     const buttonCreators: Record<CellActionName, () => IButtonBuilder> = {
//       modify: this.getModifyButton.bind(this),
//       detail: this.getDetailButton.bind(this),
//       remove: this.getRemoveButton.bind(this),
//       create: this.getCreateButton.bind(this),
//     };

//     return buttonCreators[buttonType]?.();
//   }

//   private getModifyButton(): IButtonBuilder {
//     return {
//       color: 'secondary',
//       name: '수정',
//       // navigator: {
//       //   type: 'push',
//       //   pathname: ':rowId/modify',
//       // },
//     };
//   }

//   private getDetailButton(): IButtonBuilder {
//     return {
//       color: 'primary',
//       name: '상세',
//       // navigator: {
//       //   type: 'push',
//       //   pathname: ':rowId/detail',
//       // },
//     };
//   }

//   private getRemoveButton(): IButtonBuilder {
//     return {
//       color: 'danger',
//       name: '삭제',
//       // mutation: {
//       //   name: `delete${upperFirst(this.resourceName)}`,
//       //   invalidationKey: `/api/v1/${Pluaralize(this.resourceName || '')}`,
//       // },
//     };
//   }

//   private getCreateButton(): IButtonBuilder {
//     return {
//       color: 'success',
//       name: '추가',
//       // navigator: {
//       //   type: 'push',
//       //   pathname: ':rowId/create',
//       // },
//     };
//   }
// }
