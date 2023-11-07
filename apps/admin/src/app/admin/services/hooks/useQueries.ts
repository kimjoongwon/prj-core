import { useServicesQuery } from '@hooks';
import { useState } from './useState';

export const useQueries = ({
  state,
}: {
  state: ReturnType<typeof useState>;
}) => {
  return {
    servicesQuery: useServicesQuery(state.query),
  };
};
