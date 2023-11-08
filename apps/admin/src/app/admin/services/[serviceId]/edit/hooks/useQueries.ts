import { useServiceFormQuery, useServiceQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { serviceId = 'new' } = useParams();
  const serviceQuery = useServiceQuery({ id: serviceId as string });
  const serviceFormQuery = useServiceFormQuery();

  return {
    serviceFormQuery,
    serviceQuery,
  };
};
