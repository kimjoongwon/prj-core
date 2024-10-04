import { galaxy } from '../../../../providers';
import { useState } from './useState';

export const useHandlers = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  const onClickCreate = () => {
    console.log('onClickCreate');
  };
  const onClickRemove = () => {
    console.log('onClickRemove');
  };

  const onClickRow = () => {
    if (state.selectedKeys.length === 0) {
      return;
    }
    galaxy.router.push({
      url: '/admin/main/services/:serviceId',
      params: { serviceId: state.selectedKeys[0] },
    });
  };

  return {
    onClickRow,
    onClickCreate,
    onClickRemove,
  };
};
