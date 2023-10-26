import { useState } from './useState';
import { useMemo } from 'react';

export const useQueries = (state: ReturnType<typeof useState>) => {
  useServices
  return {
    servicesQuery: useMemo(() => servicesQuery, [{ ...state.query }]),
  };
};
