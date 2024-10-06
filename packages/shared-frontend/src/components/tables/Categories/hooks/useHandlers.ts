import { galaxy } from '../../../../providers';
import { useState } from './useState';
import { useMutations } from './useMutations';

export const useHandlers = ({
  state,
}: {
  state: ReturnType<typeof useState>;
  mutations: ReturnType<typeof useMutations>;
}) => {
  const onClickCreate = () => {
    galaxy.router.push({
      url: '/admin/main/app/services/:serviceId/categories/:categoryId/edit',
      params: { categoryId: 'new' },
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
