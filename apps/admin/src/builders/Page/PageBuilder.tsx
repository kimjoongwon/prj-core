import React, { createContext } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { PageBuilder as PageBuilderInterface } from '@shared/types';
import { ComponentBuilder } from '../ComponentBuilder';
import { Form } from '../FormBuilder';
import { Outlet } from 'react-router-dom';
import { useGetQuery } from '../../hooks/useGetQuery';
import { cloneDeep } from 'lodash-es';
import { DataGridBuilder } from '../DataGridBuilder/DataGridBuilder';
import { Text } from '@shared/frontend';
import { v4 } from 'uuid';
import { Card, Input } from '@heroui/react';

interface PageBuilderProps {
  pageBuilder: PageBuilderInterface;
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

  const { data } = useGetQuery(query);

  if (pageBuilder?.type === 'Outlet') {
    return <Outlet />;
  }

  return (
    <PageProvder state={pageBuilder?.state} data={data}>
      {pageBuilder.form && (
        <Form formBuilder={pageBuilder.form!}>
          {pageBuilder?.form?.sections?.map(section => {
            return (
              <div
                key={v4()}
                className="flex flex-1 flex-col border-1 p-4 rounded-xl space-y-4"
              >
                <Text variant="h5">{section.name}</Text>
                <Card className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                  {section.components?.map(component => (
                    <ComponentBuilder
                      key={v4()}
                      componentBuilder={component}
                      data={data}
                    />
                  ))}
                </Card>
              </div>
            );
          })}
        </Form>
      )}
      {pageBuilder.dataGrid && (
        <DataGridBuilder dataGridBuilder={pageBuilder.dataGrid} />
      )}
    </PageProvder>
  );
});
