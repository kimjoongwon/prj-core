import { HeaderBuilderProps } from '@shared/specs';

export const HeaderBuilder = (props: HeaderBuilderProps) => {
  const { table, name = '-', expandable = false } = props;

  return (
    <div>
      {expandable && (
        <button
          {...{
            onClick: table.getToggleAllRowsExpandedHandler(),
          }}
        >
          {table.getIsAllRowsExpanded() ? '📂' : '📁'}
        </button>
      )}
      {name}
    </div>
  );
};
