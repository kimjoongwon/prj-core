'use client';

import {
  app,
  DataGrid,
  GymDto,
  Pagination,
  useGetGymsByQuery,
  Text,
  HStack,
} from '@shared/frontend';
import { createContext, useContext } from 'react';
import { useColumns } from './_hooks/useColumns';
import { parseAsInteger, useQueryStates } from 'nuqs';
import {
  Button,
  ButtonProps,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
} from '@heroui/react';
import { v4 } from 'uuid';

type GymsPageContextValue = {
  dataGrid: {
    data: GymDto[];
    columns: ReturnType<typeof useColumns>;
    buttons: ButtonProps[];
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
    <Card fullWidth className="space-y-4 p-4">
      <CardHeader>
        <Text variant="h2">GYM 관리</Text>
      </CardHeader>
      <CardBody className="space-y-4">
        <HStack className="justify-start space-x-2">
          {gymsPage.dataGrid.buttons.map(button => {
            return <Button key={v4()} {...button} />;
          })}
        </HStack>
        <DataGrid
          columns={gymsPage.dataGrid?.columns}
          data={gymsPage.dataGrid?.data || []}
        />
        <Pagination totalCount={100} />
      </CardBody>
    </Card>
  );
};

const GymsPageContext = createContext<GymsPageContextValue>(
  {} as GymsPageContextValue,
);

export const GymsPageProvider = (props: GymsPageProviderProps) => {
  const { children } = props;
  const columns = useColumns();
  const buttons = app.buttonService.getLeftButtons('gyms');

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
          buttons,
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
