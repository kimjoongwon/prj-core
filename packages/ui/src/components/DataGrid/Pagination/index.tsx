import { observer } from 'mobx-react-lite';
import {
  Pagination as NextUIPagination,
  PaginationProps as NextUIPaginationProps,
} from '@nextui-org/react';
import { useMobxHookForm } from '../../../hooks';
import { MobxProps } from '../../../types';
import { get } from 'lodash-es';

interface CoCPaginationProps<T> extends NextUIPaginationProps, MobxProps<T> {}

function CoCPagination<T extends object>(props: CoCPaginationProps<T>) {
  const { state = undefined, path = '', total = 18, ...rest } = props;

  const initialValue = get(state, path);
  const { localState } = useMobxHookForm(initialValue, state, path);

  const onChangePage = (page: number) => {
    const offset = page - 1;
    localState.value = offset;
  };

  const page = localState.value + 1;

  return (
    <NextUIPagination
      {...rest}
      onChange={onChangePage}
      total={total}
      page={page}
    />
  );
}

export const Pagination = observer(CoCPagination);
