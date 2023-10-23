import { useCoCRouter } from '@hooks';
import { GroupButton } from '@coc/ui';
import { useActionColumns, useCategoryColumns } from '@columns';
import { useMemo } from 'react';
import { useQueries } from './useQueries';
import { useHandlers } from './useHandlers';
import { CATEGORY_EDIT_PAGE_PATH, CATEGORY_PAGE_PATH } from '@constants';
import { toast } from 'react-toastify';
import { Category } from '@__generated__/graphql';
import { useMutations } from './useMutations';

export const useMeta = ({
  onClickRow,
  onClickSorting,
  categoriesQuery,
  deleteCategory,
}: ReturnType<typeof useQueries> &
  ReturnType<typeof useMutations> &
  ReturnType<typeof useHandlers>) => {
  const router = useCoCRouter();

  const categoryColumns = useCategoryColumns();

  const actionColumns = useActionColumns<Category>({
    meta: {
      buttons: [
        {
          children: '수정',
          onClick: context =>
            router.push({
              url: CATEGORY_EDIT_PAGE_PATH,
              params: {
                id: context.row.original.id,
              },
            }),
        },
        {
          children: '삭제',
          onClick: context => {
            deleteCategory({
              variables: {
                id: context.row.original.id,
              },
            });
          },
        },

        {
          children: '자세히 보기',
          onClick: context =>
            router.push({
              url: CATEGORY_PAGE_PATH,
              params: {
                id: context.row.original.id,
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
          url: CATEGORY_EDIT_PAGE_PATH,
          params: {
            id: 'new',
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
      leftButtons: useMemo(() => leftButtons, [router]),
      rightButtons: useMemo(() => rightButtons, [router]),
    },
    dataGrid: {
      columns: [...categoryColumns, ...actionColumns],
      data: categoriesQuery?.data?.categories?.nodes,
      onClickRow,
      onClickSorting,
    },
    pagination: {
      totalCount: useMemo(
        () => categoriesQuery?.data?.categories?.pageInfo?.totalCount || 1,
        [categoriesQuery.data.categories?.pageInfo?.totalCount],
      ),
    },
  };
};
