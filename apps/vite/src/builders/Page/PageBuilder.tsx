import React, { createContext } from 'react';
import { observer } from 'mobx-react-lite';
import { PageBuilder as PageBuilderInterface } from '@shared/types';
import { Component } from '../Component';
import { Form, FormProvder } from '../FormBuilder';
import { Outlet } from 'react-router-dom';
import { isArray } from 'lodash-es';
import { observable } from 'mobx';
import { useGetQuery } from '../../hooks/useGetQuery';
import { Spinner } from '@nextui-org/react';
import { TableBuilder, TableProvider } from '../TableBuilder/TableBuilder';

interface PageBuilderProps {
  pageBuilder: PageBuilderInterface;
}

interface PageProviderProps {
  state: PageBuilderInterface['state'];
  children: React.ReactNode;
}

const PageContext = createContext<PageBuilderInterface['state'] | null>(null);

const PageProvder = (props: PageProviderProps) => {
  const state = observable(props.state || {});

  return (
    <PageContext.Provider value={state}>{props.children}</PageContext.Provider>
  );
};

export const usePageState = () => {
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
    <PageProvder state={pageBuilder?.state}>
      {pageBuilder.form && (
        <>
          <FormProvder
            state={pageBuilder.form.state}
            data={isArray(data) ? null : data}
          >
            <Form formBuilder={pageBuilder.form!}>
              {pageBuilder?.form?.sections?.map(section => {
                return (
                  <div>
                    {section.components?.map(component => (
                      <div className="space-y-2">
                        <Component componentBuilder={component} data={data} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </Form>
          </FormProvder>
        </>
      )}
      {pageBuilder.table && (
        <TableProvider value={pageBuilder.table?.state}>
          <TableBuilder tableBuilder={pageBuilder.table} />
        </TableProvider>
      )}
    </PageProvder>
  );
});
