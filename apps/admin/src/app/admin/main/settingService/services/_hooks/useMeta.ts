import { ButtonProps } from '@nextui-org/react';
import { router } from '@shared/frontend';

export const useMeta = () => {
  const rightButtons: ButtonProps[] = [
    {
      children: '생성',
      onClick: () => {
        router.push({
          url: '/admin/main/settingService/services/:serviceId/edit',
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
