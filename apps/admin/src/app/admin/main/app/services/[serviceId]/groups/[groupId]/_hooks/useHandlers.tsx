import {
  Button,
  CreateAssignmentDto,
  galaxy,
  SpacesTable,
  UsersTable,
} from '@shared/frontend';
import { useQueries } from './useQueries';
import { useState } from './useState';
import { useParams } from 'next/navigation';

export const useHandlers = (context: {
  queries: ReturnType<typeof useQueries>;
  state: ReturnType<typeof useState>;
}) => {
  const {
    state,
    queries: { service, users, spaces, createAssignments },
  } = context;

  const { groupId, serviceId } = useParams<{
    serviceId: string;
    groupId: string;
  }>();

  const onClickAddToGroup = () => {
    const serviceItemIds = state.selectedKeys;

    if (state.selectedKeys.length === 0) {
      return alert('선택된 키가 없습니다.');
    }

    const items: CreateAssignmentDto[] = serviceItemIds.map(serviceItemId => ({
      serviceItemId,
      serviceId,
      groupId,
    }));

    createAssignments({
      data: {
        items,
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
      USER: <UsersTable selectionMode="multiple" users={users} state={state} />,
      SPACE: (
        <SpacesTable selectionMode="multiple" spaces={spaces} state={state} />
      ),
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
