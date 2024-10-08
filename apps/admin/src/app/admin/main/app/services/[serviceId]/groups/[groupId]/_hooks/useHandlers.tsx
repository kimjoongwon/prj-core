import { Button, galaxy, UsersTable } from '@shared/frontend';
import { useQueries } from './useQueries';

export const useHandlers = (context: {
  queries: ReturnType<typeof useQueries>;
}) => {
  const {
    queries: { service, users, spaces },
  } = context;
  const onClickAddToGroup = () => {};

  const onClickCancel = () => {
    galaxy.modal.destory();
  };

  const onClickAdd = () => {
    openGroupAddModal();
  };

  const openGroupAddModal = () => {
    const bodys: Record<string, React.ReactNode> = {
      USER: (
        <UsersTable
          selectionMode="multiple"
          users={users}
          state={{ selectedKeys: [] }}
        />
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
