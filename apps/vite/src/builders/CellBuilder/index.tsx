import { Button } from '@shared/frontend';
import { CellContext } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { PathUtil } from '@shared/utils';

export const CellBuilder = ({
  row,
  getValue,
  column,
}: CellContext<unknown, unknown>) => {
  const navigate = useNavigate();

  const onPressEdit = () => {
    const params = column.columnDef.meta.edit.button.flow.try.paramKeys.reduce(
      (acc, key) => {
        acc[key] = row.original.id;
        return acc;
      },
      {},
    );

    navigate(
      PathUtil.getUrlWithParamsAndQueryString(
        column.columnDef.meta.edit.button.flow.try.pathname,
        params,
      ),
    );
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
