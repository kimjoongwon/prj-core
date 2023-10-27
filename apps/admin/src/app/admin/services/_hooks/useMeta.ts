import { useCoCRouter, useCoCTable } from '@hooks';
import { GroupButton } from '@coc/ui';
import { useActionColumns, useUserColumns } from '@columns';
import { User } from '@__generated__/graphql';
import { useMemo } from 'react';
import { useQueries } from './useQueries';
import { useHandlers } from './useHandlers';
import { USER_EDIT_PAGE_PATH, USER_PAGE_PATH } from '@constants';
import { toast } from 'react-toastify';
import { useServiceColumns } from '../../../shared/columns/useServiceColumns';

export const useMeta = ({
  onClickRow,
  onClickSorting,
  servicesQuery,
}: ReturnType<typeof useQueries> & ReturnType<typeof useHandlers>) => {
  const router = useCoCRouter();
  const serviceColumns = useServiceColumns();

  const actionColumns = useActionColumns<User>({
    meta: {
      buttons: [
        {
          children: '수정',
          onClick: context =>
            router.push({
              url: USER_EDIT_PAGE_PATH,
              params: {
                userId: context.row.original.id,
              },
            }),
        },
        {
          children: '자세히 보기',
          onClick: context =>
            router.push({
              url: USER_PAGE_PATH,
              params: {
                userId: context.row.original.id,
              },
            }),
        },
      ],
    },
  });

  const leftButtons: GroupButton[] = [
    {
      children: '생성',
      color: 'primary',
      onClick: () =>
        router.push({
          url: USER_EDIT_PAGE_PATH,
          params: {
            userId: 'new',
          },
        }),
    },
  ];

  const rightButtons: GroupButton[] = [
    {
      children: '삭제',
      color: 'danger',
      onClick: () => toast.error('삭제되었습니다.'),
    },
  ];

  return {
    buttonGroup: {
      leftButtons: useMemo(() => leftButtons, []),
      rightButtons: useMemo(() => rightButtons, []),
    },
    dataGrid: {
      columns: [...serviceColumns, ...actionColumns],
      data: servicesQuery?.data?.services.nodes,
      onClickRow,
      onClickSorting,
    },
    pagination: {
      totalCount: useMemo(
        () => servicesQuery?.data?.services.pageInfo?.totalCount || 1,
        [],
      ),
    },
  };
};
