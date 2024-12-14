import { APIManager, DataGrid } from '@shared/frontend';
import { PageBuilder } from '@shared/types';
import { toJS } from 'mobx';
import { CellBuilder } from '../CellBuilder';
import { HeaderBuilder } from '../HeaderBuilder';

interface TableBuilderProps {
  state: PageBuilder;
}

export const TableBuilder = ({ state }: TableBuilderProps) => {
  console.log('state', toJS(state.table?.query));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { data: response } = APIManager[
    state.table?.apiKey as keyof typeof APIManager
  ](state.table?.query, {
    query: {
      enabled: !!state?.table?.apiKey,
    },
  });

  const columns = state?.table?.columns.map(column => {
    return {
      ...column,
      header: HeaderBuilder,
      cell: CellBuilder,
    };
  });

  return (
    <DataGrid data={toJS(response?.data || [])} columns={toJS(columns) || []} />
  );
};
