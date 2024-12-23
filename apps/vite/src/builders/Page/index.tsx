import React, { createContext } from 'react';
import { v4 } from 'uuid';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Grid2 as Grid } from '@mui/material';
import { APIManager, Text } from '@shared/frontend';
import { PageBuilder } from '@shared/types';
import { Component } from '../Component';
import { Form, FormProvder } from '../FormBuilder';
import { Outlet, useParams } from 'react-router-dom';
import { TableBuilder } from '../TableBuilder';
import { cloneDeep, isArray, isEmpty } from 'lodash-es';
import { Mount } from '../Mount';

interface PageBuilderProps {
  pageBuilder: PageBuilder;
}

interface PageProviderProps {
  state: PageBuilder['state'];
  children: React.ReactNode;
}

export const PageContext = createContext<PageBuilder['state'] | null>(null);

export const PageProvder = (props: PageProviderProps) => {
  const state = useLocalObservable(() => props.state!);

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

export const Page = observer((props: PageBuilderProps) => {
  const { pageBuilder } = props;
  const query = cloneDeep(pageBuilder?.query);
  const params = useParams();
  const resourceId = params?.[query?.resourceId as string];
  const serviceId = window.location.pathname.split('/')[4];
  const apiArgs: unknown[] = resourceId ? [resourceId] : [];

  if (query?.params) {
    query.params.serviceId = serviceId;
  }

  if (!isEmpty(query?.params)) {
    apiArgs.push(query?.params);
  }

  apiArgs.push({
    enabled: !!query?.name,
  });

  const queryName = query?.name as keyof typeof APIManager;

  const getQuery = query?.name
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      APIManager[queryName].apply(null, apiArgs)
    : undefined;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const data = getQuery?.data?.data;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (getQuery?.isLoading) {
    return null;
  }

  if (pageBuilder?.type === 'Outlet') {
    return <Outlet />;
  }
  return (
    <PageProvder state={pageBuilder?.state}>
      <Mount type={pageBuilder?.type} name={pageBuilder?.name}>
        <>
          {pageBuilder.form ? (
            <FormProvder
              state={pageBuilder.form.state}
              data={isArray(data) ? null : data}
            >
              <Form formBuilder={pageBuilder.form!}>
                {pageBuilder?.form?.sections?.map(section => {
                  return (
                    <React.Fragment key={v4()}>
                      <Text variant="h5">{section.name}</Text>
                      <Grid container spacing={1}>
                        {section.components?.map(component => (
                          <Grid key={v4()} {...component.gridProps}>
                            <Component componentBuilder={component} />
                          </Grid>
                        ))}
                      </Grid>
                    </React.Fragment>
                  );
                })}
              </Form>
            </FormProvder>
          ) : null}
          {pageBuilder?.type === 'Table' && (
            <TableBuilder state={pageBuilder} data={data} />
          )}
        </>
      </Mount>
    </PageProvder>
  );
});
