import { Button } from '@shared/frontend';
import { CellContext } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

export const CellBuilder = ({
  row,
  getValue,
  column,
}: CellContext<unknown, unknown>) => {
  const navigate = useNavigate();

  const onPressEdit = () => {
    navigate(column.columnDef.meta.edit.button.flow.try.pathname);
    console.log('onPressEdit');
  };

  if (column.columnDef.meta?.edit) {
    return (
      <Button size="sm" onPress={onPressEdit}>
        수정
      </Button>
    );
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (!column.columnDef.meta?.expandable) {
    return <>{getValue<string>()}</>;
  }

  return (
    <div
      style={{
        paddingLeft: `${row.depth * 2}rem`,
      }}
    >
      <div>
        {row.getCanExpand() ? (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: 'pointer' },
            }}
          >
            {row.getIsExpanded() ? '📂' : '📁'}
          </button>
        ) : (
          ''
        )}{' '}
        {getValue<string>()}
      </div>
    </div>
  );
};
