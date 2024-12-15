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

  if (column.columnDef.meta?.buttons) {
    return (
      <div className="flex space-x-1">
        {column.columnDef.meta?.buttons.map(button => {
          const onPress = () => {
            const params = button.paramKeys?.reduce((acc, key) => {
              acc[key] = row.original.id;
              return acc;
            }, {});

            console.log('params', params);
            console.log('button', button);
            navigate(
              PathUtil.getUrlWithParamsAndQueryString(button.link, params),
            );
          };
          return <Button onPress={onPress}>{button.name}</Button>;
        })}
      </div>
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
