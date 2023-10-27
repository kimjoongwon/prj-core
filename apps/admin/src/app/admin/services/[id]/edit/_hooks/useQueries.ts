import { useServiceFormQuery, useServiceQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { id = 'new' } = useParams();
  const serviceQuery = useServiceQuery({ id: id as string });
  const serviceFormQuery = useServiceFormQuery();

  return {
    serviceFormQuery,
    serviceQuery,
  };
};
