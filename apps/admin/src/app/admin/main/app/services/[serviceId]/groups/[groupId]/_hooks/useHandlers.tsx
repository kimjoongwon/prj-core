import {
  Button,
  CreateAssignmentDto,
  galaxy,
  ServiceItemModalBody,
} from '@shared/frontend';
import { useQueries } from './useQueries';
import { useState } from './useState';

export const useHandlers = (context: {
  queries: ReturnType<typeof useQueries>;
  state: ReturnType<typeof useState>;
}) => {
  const {
    queries: { service, users, createAssignments, group },
    state,
  } = context;
  const onClickAddToGroup = () => {
    if (state?.selectedKeys?.length === 0) {
      galaxy.modal.destory();
      return;
    }

    const createAssignmentsDtos: CreateAssignmentDto[] =
      state?.selectedKeys?.map(id => ({
        serviceItemId: id!,
        serviceId: service?.id!,
        groupId: group?.id!,
      })) || [];

    createAssignments({
      data: {
        items: createAssignmentsDtos,
      },
    });
  };

  const onClickCancel = () => {
    galaxy.modal.destory();
  };

  const onClickAdd = () => {
    openGroupAddModal();
  };

  const openGroupAddModal = () => {
    galaxy.modal.build({
      header: '이용자 목록',
      body: <ServiceItemModalBody items={users} state={state} type="user" />,
      footer: (
        <Button onClick={onClickAddToGroup}>{service?.label} 추가</Button>
      ),
    });
  };

  return {
    onClickAdd,
    onClickAddToGroup,
    onClickCancel,
  };
};
