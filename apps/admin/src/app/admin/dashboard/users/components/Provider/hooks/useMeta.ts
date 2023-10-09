import { useCoCRouter } from '@hooks';
import { GroupButton } from '@coc/ui';
import { useActionColumns, useUserColumns } from '@columns';
import { User } from '@__generated__/graphql';

export const useMeta = () => {
  const router = useCoCRouter();

  const userColumns = useUserColumns();

  const actionColumns = useActionColumns<User>({
    meta: {
      buttons: [
        {
          children: '수정',
          onClick: context =>
            router.push({
              url: '/admin/dashboard/users/:userId/edit',
              params: {
                userId: context.row.original.cuid,
              },
            }),
        },
        {
          children: '자세히 보기',
          onClick: context =>
            router.push({
              url: '/admin/dashboard/users/:userId',
              params: {
                userId: context.row.original.cuid,
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
          url: '/admin/dashboard/users/:userId/edit',
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
    },
  ];

  return {
    leftButtons,
    rightButtons,
    columns: [...userColumns, ...actionColumns],
  };
};
