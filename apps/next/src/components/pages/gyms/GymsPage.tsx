'use client';

import {
  Button,
  DataGrid,
  GymDto,
  Pagination,
  useGetGymsByQuery,
  VStack,
} from '@shared/frontend';
import { createContext, useContext } from 'react';
import { useColumns } from './_hooks/useColumns';
import { useSearchParams } from 'next/navigation';
import { parseAsInteger, useQueryStates } from 'nuqs';

type GymsPageContextValue = {
  dataGrid: {
    data: GymDto[];
    columns: ReturnType<typeof useColumns>;
  };
  pagination: {
    totalCount: number;
  };
};

type GymsPageProviderProps = {
  children: React.ReactNode;
};

export const GymsPage = () => {
  const gymsPage = useGymsPage();

  return (
    <VStack className="w-full space-y-2">
      <Button onPress={() => {}}>Test</Button>
      <DataGrid
        columns={gymsPage.dataGrid?.columns}
        data={gymsPage.dataGrid?.data || []}
      />
      <Pagination totalCount={100} />
    </VStack>
  );
};

const GymsPageContext = createContext<GymsPageContextValue>(
  {} as GymsPageContextValue,
);

export const GymsPageProvider = (props: GymsPageProviderProps) => {
  const { children } = props;
  const columns = useColumns();
  const [queryStates] = useQueryStates({
    skip: parseAsInteger.withDefault(0),
    take: parseAsInteger.withDefault(10),
  });

  const { data: getGymsByQueryResponse } = useGetGymsByQuery(queryStates);

  return (
    <GymsPageContext.Provider
      value={{
        pagination: {
          totalCount: getGymsByQueryResponse?.meta?.itemCount || 0,
        },
        dataGrid: {
          columns,
          data: getGymsByQueryResponse?.data || [],
        },
      }}
    >
      {children}
    </GymsPageContext.Provider>
  );
};

export const useGymsPage = () => {
  return useContext(GymsPageContext);
};
