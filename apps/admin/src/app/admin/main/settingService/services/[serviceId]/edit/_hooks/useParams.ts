import { useParams } from 'next/navigation';

export const usePageParams = () => {
  return useParams<{ serviceId: string }>();
};
