import { useGetAllService } from '@shared/frontend';

export const useProps = () => {
  const { data: reseponeEntity } = useGetAllService();

  return {
    services: reseponeEntity?.data || [],
  };
};
