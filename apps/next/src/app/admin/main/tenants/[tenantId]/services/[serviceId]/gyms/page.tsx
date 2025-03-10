'use client';

import { DataGrid, useGetGymsByQuery, VStack } from '@shared/frontend';
import { createContext, useContext } from 'react';
import { useColumns } from './_hooks/useColumns';

const GymsPage = () => {
  const { data: getGymsByQueryResponse } = useGetGymsByQuery();
  const { columns } = useGymsPage();

  return (
    <VStack className="w-full space-y-2">
      {/* {adminButtons.map((button, index) => (
        <Button key={index} {...button} />
      ))} */}
      <DataGrid columns={columns} data={getGymsByQueryResponse?.data || []} />
    </VStack>
  );
};

export default GymsPage;

type GymsPageContextValue = {
  columns: ReturnType<typeof useColumns>;
};
type GymsPageProviderProps = {
  children: React.ReactNode;
};

const GymsPageContext = createContext<GymsPageContextValue>({
  columns: [],
  adminButtons: [],
} as GymsPageContextValue);

export const GymsPageProvider = (props: GymsPageProviderProps) => {
  const { children } = props;
  const columns = useColumns();

  return (
    <GymsPageContext.Provider
      value={{
        columns,
      }}
    >
      {children}
    </GymsPageContext.Provider>
  );
};

export const useGymsPage = () => {
  return useContext(GymsPageContext);
};
