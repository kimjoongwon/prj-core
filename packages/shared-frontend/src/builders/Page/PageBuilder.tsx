'use client';

import React, { createContext } from 'react';
import { observer } from 'mobx-react-lite';
import { PageBuilder as PageBuilderInterface } from '@shared/types';
import { InputBuilder } from '../InputBuilder';
import { DataGridBuilder } from '../DataGridBuilder/DataGridBuilder';
import { HStack, Text, VStack } from '@shared/frontend';
import { v4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { Divider } from '@heroui/divider';
import { observable } from 'mobx';
import { Form } from '@heroui/react';
import { FormButtonBuilder } from '../FormButtonBuilder/FormButtonBuilder';

interface PageBuilderProps {
  pageBuilder?: PageBuilderInterface;
}

interface PageProviderProps {
  state: PageBuilderInterface['state'];
  isFetchedAfterMount?: boolean;
  children: React.ReactNode;
}

const PageContext = createContext<PageBuilderInterface['state']>(
  {} as PageBuilderInterface['state'],
);

const PageProvder = observer((props: PageProviderProps) => {
  const state = observable(props.state || {});

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
  console.log('PageBuilder props:', pageBuilder);

  return (
    <PageProvder state={pageBuilder?.state}>
      <div className="font-bold text-xl">{pageBuilder?.name}</div>
      <Divider />
      {pageBuilder?.form && (
        <Form className="overflow-auto pb-[200px] scrollbar-hide">
          {pageBuilder?.form?.sections?.map(section => {
            return (
              <div
                key={v4()}
                className="border-1 p-4 rounded-xl space-y-4 flex flex-col w-full"
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
                    <HStack key={v4()} className="justify-evenly flex-wrap">
                      {stack.inputs?.map(input => {
                        return <InputBuilder key={v4()} inputBuilder={input} />;
                      })}
                    </HStack>
                  );
                })}
              </div>
            );
          })}
          {pageBuilder.form?.button && (
            <FormButtonBuilder pageBuilder={pageBuilder} />
          )}
        </Form>
      )}
      {pageBuilder?.dataGrid && (
        <DataGridBuilder dataGridBuilder={pageBuilder.dataGrid} />
      )}
    </PageProvder>
  );
});
