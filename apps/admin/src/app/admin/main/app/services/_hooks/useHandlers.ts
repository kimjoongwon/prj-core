import { galaxy, ServiceDto } from '@shared/frontend';

export const useHandlers = () => {
  const onClickRow = (row: ServiceDto) => {
    galaxy.router.push({
      url: '/admin/main/services/:serviceId',
      params: { serviceId: row.id },
    });
  };

  return { onClickRow };
};
