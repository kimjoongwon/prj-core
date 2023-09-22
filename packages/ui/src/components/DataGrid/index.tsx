import { observer } from 'mobx-react-lite';

export type { DataGridButton } from './DataGrid';
import { DataGrid as BaseDataGrid } from './DataGrid';
export * from './Pagination';
export * from './cells';

export const DataGrid = observer(BaseDataGrid);
