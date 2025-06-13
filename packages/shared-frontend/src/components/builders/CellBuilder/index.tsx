import { CellBuilderProps } from '@shared/types';
import {
  DateCell,
  DateTimeCell,
  TimeCell,
  ActionCell,
  TextCell,
  NumberCell,
  BooleanCell,
  ExpandableCell,
} from '../../cells';

// type에 따른 Cell 컴포넌트 매핑
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

export const CellBuilder = (props: CellBuilderProps) => {
  const { getValue, type, resourceName } = props;
  console.log('resourceName:', resourceName);
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
