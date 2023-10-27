import { useServicesQuery } from '@hooks';
import { useState } from './useState';
import { useMemo } from 'react';

export const useQueries = (state: ReturnType<typeof useState>) => {
  return {
    servicesQuery: useServicesQuery(state.query),
  };
};
