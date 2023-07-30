import { observer } from 'mobx-react-lite';
import { MobxProps } from '../../../types';
import { useMobxHookForm } from '../../../hooks';
import { getMobxValue } from '@kimjwally/utils';
import {
  Pagination as NextUIPagination,
  PaginationProps as NextUIPaginationProps,
} from '@nextui-org/react';

interface CoCPaginationProps<T> extends NextUIPaginationProps, MobxProps<T> {}

function CoCPagination<T extends object>(props: CoCPaginationProps<T>) {
  const { state = undefined, path = '', total = 18, ...rest } = props;

  const initialValue = getMobxValue(state, path);
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
