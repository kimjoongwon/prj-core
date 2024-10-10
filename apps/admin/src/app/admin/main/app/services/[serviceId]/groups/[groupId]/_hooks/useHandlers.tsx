import {
  Button,
  CreateAssignmentDto,
  galaxy,
  UsersTable,
} from '@shared/frontend';
import { useQueries } from './useQueries';
import { useState } from './useState';
import { create } from 'domain';

export const useHandlers = (context: {
  queries: ReturnType<typeof useQueries>;
  state: ReturnType<typeof useState>;
}) => {
  const {
    queries: { service, users, createAssignments, group },
    state,
  } = context;
  console.log('users', users);
  const onClickAddToGroup = () => {
    if (state.selectedKeys.length === 0) {
      galaxy.modal.destory();
      return;
    }

    console.log('state.selectedKeys', { ...state.selectedKeys });

    const createAssignmentsDtos: CreateAssignmentDto[] = state.selectedKeys.map(
      id => ({
        serviceItemId: id!,
        serviceId: service?.id!,
        groupId: group?.id!,
      }),
    );

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
    const bodys: Record<string, React.ReactNode> = {
      user: <UsersTable selectionMode="multiple" users={users} state={state} />,
    };

    const body = service?.name ? bodys[service?.name] : <></>;
    galaxy.modal.build({
      header: '이용자 목록',
      body: body,
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
