import React, { createContext } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { PageBuilder as PageBuilderInterface } from '@shared/types';
import { ComponentBuilder } from '../ComponentBuilder';
import { Form } from '../FormBuilder';
import { Outlet } from 'react-router-dom';
import { useGetQuery } from '../../hooks/useGetQuery';
import { Spinner } from '@nextui-org/react';
import { cloneDeep } from 'lodash-es';
import { DataGridBuilder } from '../DataGridBuilder/DataGridBuilder';
import { Text } from '@shared/frontend';

interface PageBuilderProps {
  pageBuilder: PageBuilderInterface;
}

interface PageProviderProps {
  state: PageBuilderInterface['state'];
  data: any;
  children: React.ReactNode;
}

const PageContext = createContext<PageBuilderInterface['state']>(
  {} as PageBuilderInterface['state'],
);

const PageProvder = (props: PageProviderProps) => {
  const { data } = props;
  const state = useLocalObservable(() => {
    const pageState = cloneDeep(props.state) || {};
    if (data && pageState) {
      pageState.form = {
        ...pageState.form,
        data,
      };
    }
    return pageState;
  });

  return (
    <PageContext.Provider value={state}>{props.children}</PageContext.Provider>
  );
};

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

  const { data, isLoading } = useGetQuery(query);

  if (isLoading) {
    return <Spinner />;
  }

  if (pageBuilder?.type === 'Outlet') {
    return <Outlet />;
  }

  return (
    <PageProvder state={pageBuilder?.state} data={data}>
      {pageBuilder.form && (
        <Form formBuilder={pageBuilder.form!}>
          {pageBuilder?.form?.sections?.map(section => {
            return (
              <div className="border-1 p-4 rounded-xl space-y-2">
                <Text variant="h5">{section.name}</Text>
                {section.components?.map(component => (
                  <div className="space-y-2">
                    <ComponentBuilder
                      componentBuilder={component}
                      data={data}
                    />
                  </div>
                ))}
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
