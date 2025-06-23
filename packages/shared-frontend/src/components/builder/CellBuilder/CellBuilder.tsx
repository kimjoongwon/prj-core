import { CellBuilderProps } from '@shared/types';
import { DateCell } from '../../cell/DateCell/DateCell';
import { DateTimeCell } from '../../cell/DateTimeCell/DateTimeCell';
import { TimeCell } from '../../cell/TimeCell/TimeCell';
import { ActionCell } from '../../cell/ActionCell/ActionCell';
import { TextCell } from '../../cell/TextCell/TextCell';
import { NumberCell } from '../../cell/NumberCell/NumberCell';
import { BooleanCell } from '../../cell/BooleanCell/BooleanCell';
import { ExpandableCell } from '../../cell/ExpandableCell/ExpandableCell';

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
  } as Record<string, React.ComponentType<CellBuilderProps>>;
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
