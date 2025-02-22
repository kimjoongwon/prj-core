'use client';

import React, { createContext, Suspense } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { PageBuilder as PageBuilderInterface } from '@shared/types';
import { InputBuilder } from '../InputBuilder';
import { useGetQuery } from '../../hooks/useGetQuery';
import { cloneDeep } from 'lodash-es';
import { DataGridBuilder } from '../DataGridBuilder/DataGridBuilder';
import { HStack, Text, VStack } from '@shared/frontend'; import { ButtonBuilder } from '../ButtonBuilder';
import { v4 } from 'uuid';

interface PageBuilderProps {
  pageBuilder?: PageBuilderInterface;
}

interface PageProviderProps<T> {
  state: PageBuilderInterface['state'];
  data: T;
  isFetchedAfterMount?: boolean;
  children: React.ReactNode;
}

const PageContext = createContext<PageBuilderInterface['state']>(
  {} as PageBuilderInterface['state'],
);

const PageProvder = observer(
  <T extends object>(props: PageProviderProps<T>) => {
    const { data } = props;
    const pageState = cloneDeep(props.state) || {};
    if (data && pageState) {
      pageState.form = {
        ...pageState.form,
        data,
      };
    }

    const state = useLocalObservable(() => pageState);

    return (
      <PageContext.Provider value={state}>
        {props.children}
      </PageContext.Provider>
    );
  },
);

export const usePageState = (): PageBuilderInterface['state'] => {
  const state = React.useContext(PageContext);
  if (!state) {
    throw new Error('useState must be used within a PageProvider');
  }
  return state;
};

export const PageBuilder = observer((props: PageBuilderProps) => {
  const { pageBuilder } = props;
  const query = pageBuilder?.query;
  const { data } = useGetQuery(query);

  return (
    <PageProvder state={pageBuilder?.state} data={data}>
      {pageBuilder?.form && (
        <>
          {pageBuilder.form?.button && (
            <ButtonBuilder buttonBuilder={pageBuilder.form.button} />
          )}
          {pageBuilder?.form?.sections?.map(section => {
            return (
              <div
                key={v4()}
                className="border-1 p-4 rounded-xl space-y-4 flex flex-1 flex-col w-full"
              >
                <Text variant="h5">{section.name}</Text>
                <Suspense fallback={<div>loading...</div>}>
                  {section.stacks?.map(stack => {
                    if (stack.type === 'VStack') {
                      return (
                        <VStack key={v4()} className="space-y-2">
                          {stack.inputs?.map(input => {
                            return (
                              <InputBuilder key={v4()} inputBuilder={input} />
                            );
                          })}
                        </VStack>
                      );
                    }
                    return (
                      <HStack key={v4()} className="space-y-2">
                        {stack.inputs?.map(input => {
                          return (
                            <InputBuilder key={v4()} inputBuilder={input} />
                          );
                        })}
                      </HStack>
                    );
                  })}
                </Suspense>
              </div>
            );
          })}
        </>
      )}
      {pageBuilder?.dataGrid && (
        <DataGridBuilder dataGridBuilder={pageBuilder.dataGrid} />
      )}
    </PageProvder>
  );
});
