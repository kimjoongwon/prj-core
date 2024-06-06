import { MyUnivSearchParams } from '@shared/frontend';
import { useParams } from 'next/navigation';

export const useContext = () => {
  const { serviceId } = useParams<{ serviceId: string }>();

  const queryString = new MyUnivSearchParams().getQueryString(
    'serviceId',
    serviceId,
  );

  return {
    queryString,
    serviceId,
  };
};
