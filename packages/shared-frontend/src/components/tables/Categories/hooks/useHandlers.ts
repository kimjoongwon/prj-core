import { useParams } from 'next/navigation';
import { galaxy } from '../../../../providers';
import { useState } from './useState';

export const useHandlers = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  const { serviceId } = useParams<{ serviceId: string }>();

  const onClickCreate = () => {
    galaxy.router.push({
      url: '/admin/main/app/services/:serviceId/categories/:categoryId/edit',
      params: {
        serviceId,
        categoryId: 'new',
      },
    });
  };

  const onClickRemove = () => {
    const selectedRowIds = state.selectedKeys;
    if (selectedRowIds.length === 0) {
      return alert('삭제할 항목을 선택해주세요.');
    }
  };

  return {
    onClickCreate,
    onClickRemove,
  };
};
