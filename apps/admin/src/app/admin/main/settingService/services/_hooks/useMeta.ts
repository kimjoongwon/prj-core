import { ButtonProps } from '@nextui-org/react';
import { galaxy } from '@shared/frontend';

export const useMeta = () => {
  const rightButtons: ButtonProps[] = [
    {
      children: '생성',
      onClick: () => {
        galaxy.router.push({
          url: '/admin/main/settingService',
          params: {
            serviceId: 'new',
          },
        });
      },
    },
  ];

  return {
    rightButtons,
  };
};
