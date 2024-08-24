import { GalaxySearchParams } from '@shared/frontend';
import { useParams } from 'next/navigation';

export const useContext = () => {
  const { serviceId } = useParams<{ serviceId: string }>();

  const queryString = new GalaxySearchParams().getQueryString(
    'serviceId',
    serviceId,
  );

  return {
    queryString,
    serviceId,
  };
};
