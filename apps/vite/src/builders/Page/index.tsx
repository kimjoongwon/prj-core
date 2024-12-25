import React, { createContext } from 'react';
import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Grid2 as Grid } from '@mui/material';
import { APIManager, Text, VStack } from '@shared/frontend';
import { PageBuilder } from '@shared/types';
import { Component } from '../Component';
import { Form, FormProvder } from '../FormBuilder';
import { Outlet, useParams } from 'react-router-dom';
import { cloneDeep, isArray } from 'lodash-es';
import { observable } from 'mobx';

interface PageBuilderProps {
  pageBuilder: PageBuilder;
}

interface PageProviderProps {
  state: PageBuilder['state'];
  children: React.ReactNode;
}

const PageContext = createContext<PageBuilder['state'] | null>(null);

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

export const Page = observer((props: PageBuilderProps) => {
  const { pageBuilder } = props;
  const query = cloneDeep(pageBuilder?.query);
  const params = useParams();
  const serviceId = window.location.pathname.split('/')[4];
  const apiArgs: unknown[] = [];

  if (query?.hasResourceId) {
    apiArgs.push(params?.resourceId);
  }

  if (query?.hasServiceId) {
    query.params.serviceId = serviceId;
  }

  if (query?.hasParams) {
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
      {pageBuilder.form ? (
        <FormProvder
          state={pageBuilder.form.state}
          data={isArray(data) ? null : data}
        >
          <Form formBuilder={pageBuilder.form!}>
            {pageBuilder?.form?.sections?.map(section => {
              return (
                <Grid container spacing={1}>
                  {section.components?.map(component => (
                    <Grid key={v4()} {...component.gridProps}>
                      <Component componentBuilder={component} data={data} />
                    </Grid>
                  ))}
                </Grid>
              );
            })}
          </Form>
        </FormProvder>
      ) : null}
    </PageProvder>
  );
});
