'use client';

import { GymEdit } from '@/components';
import { createContext } from 'vm';

const GymEditPage = () => {
  return <GymEdit />;
};

export default GymEditPage;

const GymEditPageContext = createContext();

export const GymPageProvider = () => {
  return (
    <GymEditPageContext.Provider value={{}}>
      <GymEditPage />
    </GymEditPageContext.Provider>
  );
};
