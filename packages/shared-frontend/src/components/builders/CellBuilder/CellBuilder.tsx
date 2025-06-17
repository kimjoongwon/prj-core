import { CellBuilderProps } from '@shared/types';
import { DateCell } from '../../cells/Date/DateCell';
import { DateTimeCell } from '../../cells/DateTime/DateTimeCell';
import { TimeCell } from '../../cells/Time/TimeCell';
import { ActionCell } from '../../cells/Action/ActionCell';
import { TextCell } from '../../cells/Text/TextCell';
import { NumberCell } from '../../cells/Number/NumberCell';
import { BooleanCell } from '../../cells/Boolean/BooleanCell';
import { ExpandableCell } from '../../cells/Expandable/ExpandableCell';

export const CellBuilder = (props: CellBuilderProps) => {
  const { getValue, type } = props;
  const cellComponentMap = {
    date: DateCell,
    dateTime: DateTimeCell,
    time: TimeCell,
    'row-actions': ActionCell,
    text: TextCell,
    number: NumberCell,
    boolean: BooleanCell,
    expandable: ExpandableCell,
  } as const;
  // type에 따라 적절한 Cell 컴포넌트 사용
  if (type && type in cellComponentMap) {
    const CellComponent =
      cellComponentMap[type as keyof typeof cellComponentMap];
    return <CellComponent {...props} />;
  }

  // 기본 fallback
  return (
    <div>
      <span>{getValue<string>()}</span>
    </div>
  );
};
