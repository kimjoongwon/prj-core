'use client';

import { GymsPage, GymsPageProvider } from '@/components';

const Gyms = () => {
  return (
    <GymsPageProvider>
      <GymsPage />
    </GymsPageProvider>
  );
};

export default Gyms;
