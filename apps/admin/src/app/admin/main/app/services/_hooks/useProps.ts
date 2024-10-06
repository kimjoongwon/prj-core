import { useGetAllService } from '@shared/frontend';
import { useHandlers } from './useHandlers';

export const useProps = () => {
  const { onClickRow } = useHandlers();
  const { data: reseponeEntity } = useGetAllService();

  return {
    services: reseponeEntity?.data || [],
    onClickRow,
  };
};
