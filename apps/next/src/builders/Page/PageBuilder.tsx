'use client';

import React, { createContext } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { PageBuilder as PageBuilderInterface } from '@shared/types';
import { InputBuilder } from '../InputBuilder';
import { Form } from '../FormBuilder';
import { useGetQuery } from '../../hooks/useGetQuery';
import { cloneDeep } from 'lodash-es';
import { DataGridBuilder } from '../DataGridBuilder/DataGridBuilder';
import { HStack, Text, VStack } from '@shared/frontend';
import { v4 } from 'uuid';

interface PageBuilderProps {
  pageBuilder?: PageBuilderInterface;
}

interface PageProviderProps {
  state: PageBuilderInterface['state'];
  data: any;
  isFetchedAfterMount?: boolean;
  children: React.ReactNode;
}

const PageContext = createContext<PageBuilderInterface['state']>(
  {} as PageBuilderInterface['state'],
);

const PageProvder = observer((props: PageProviderProps) => {
  console.log('props.state', props.state);
  const { data } = props;
  const pageState = cloneDeep(props.state) || {};
  if (data && pageState) {
    pageState.form = {
      ...pageState.form,
      data,
    };
  }

  const state = useLocalObservable(() => pageState);

  console.log('state', state);

  return (
    <PageContext.Provider value={state}>{props.children}</PageContext.Provider>
  );
});

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
  console.log('pageBuilder', pageBuilder);
  const { data } = useGetQuery(query);

  return (
    <PageProvder state={pageBuilder?.state} data={data}>
      {pageBuilder?.form && (
        <Form formBuilder={pageBuilder?.form!}>
          {pageBuilder?.form?.sections?.map(section => {
            return (
              <div
                key={v4()}
                className="border-1 p-4 rounded-xl space-y-4 flex flex-1 flex-col w-full"
              >
                <Text variant="h5">{section.name}</Text>
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
                        return <InputBuilder key={v4()} inputBuilder={input} />;
                      })}
                    </HStack>
                  );
                })}
              </div>
            );
          })}
        </Form>
      )}
      {pageBuilder?.dataGrid && (
        <DataGridBuilder dataGridBuilder={pageBuilder.dataGrid} />
      )}
    </PageProvder>
  );
});
