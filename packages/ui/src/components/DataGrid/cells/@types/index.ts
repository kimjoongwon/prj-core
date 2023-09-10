import { HeaderContext } from '@tanstack/react-table';
import { MobxProps } from '../../../../types';

export interface HeaderCellProps<T, M> {
  headerContext: HeaderContext<T, string>;
  mobxProps: MobxProps<M>;
}
