import { useGroupFormQuery } from '@hooks';
import { useParams } from 'next/navigation';

export const useQueries = () => {
  const { id = 'new' } = useParams();
  const groupFormQuery = useGroupFormQuery({
    id: id as string,
  });

  return {
    groupFormQuery,
  };
};
