import { ButtonProps } from '@nextui-org/react';
import {
  getGetAllServiceQueryKey,
  router,
  useCreateService,
} from '@shared/frontend';
import { state } from '../page';
import { useQueryClient } from '@tanstack/react-query';

export const useMeta = () => {
  const { mutateAsync: createService } = useCreateService();
  const queryClient = useQueryClient();

  const rightButtons: ButtonProps[] = [
    {
      children: '목록',
      onClick: async () => {
        createService({
          data: { name: state.form.name!, label: state.form.label || '' },
        });

        queryClient.invalidateQueries({
          queryKey: getGetAllServiceQueryKey(),
        });

        router.push({
          url: '/admin/main/settingService/services',
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
