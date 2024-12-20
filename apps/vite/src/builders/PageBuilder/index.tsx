import React from 'react';
import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Container, Grid2 as Grid } from '@mui/material';
import { APIManager, Text, useGetCategoryById } from '@shared/frontend';
import { PageBuilder as PageBuilderState } from '@shared/types';
import { ComponentBuilder } from '../ComponentBuilder';
import { FormBuilder } from '../FormBuilder';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { TableBuilder } from '../TableBuilder';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { cloneDeep, get, isEmpty, set } from 'lodash-es';

interface PageBuilderProps {
  state: PageBuilderState | undefined;
}

export const PageBuilder = observer((props: PageBuilderProps) => {
  const { state } = props;

  const navigate = useNavigate();
  const serviceId = window.location.pathname.split('/')[4];
  const params = useParams();
  const api = cloneDeep(state?.api);

  const resourceId = params?.[api?.query.resourceId as string];
  const apiArgs: unknown[] = resourceId ? [resourceId] : [];
  console.log('serviceId', serviceId);
  console.log('api', api);
  if (api?.query.params) {
    console.log('-?');
    api.query.params.serviceId = serviceId;
  }

  if (!isEmpty(api?.query.params)) {
    apiArgs.push(api?.query.params);
  }

  const isQueryExist =
    !!APIManager?.[api?.query.name as keyof typeof APIManager];

  if (isQueryExist) {
    apiArgs.push({
      enabled: !!api?.query.name,
    });
  }

  console.log('apiArgs', apiArgs);

  const getQuery = isQueryExist
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      APIManager?.[api?.query.name as keyof typeof APIManager].apply(
        null,
        apiArgs,
      )
    : [];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const data = getQuery?.data?.data || [];

  if (state?.type === 'Outlet') {
    return <Outlet />;
  }

  const renderContainer = (children: React.ReactNode) => {
    if (state?.type === 'Form') {
      return (
        <Modal isOpen={true} onClose={() => navigate('..')}>
          <ModalContent>
            <ModalHeader>{state.name}</ModalHeader>
            <ModalBody>{children}</ModalBody>
          </ModalContent>
        </Modal>
      );
    }

    return <Container maxWidth="xl">{children}</Container>;
  };

  return renderContainer(
    !state?.form ? null : (
      <>
        <FormBuilder state={state.form!}>
          {state?.form?.sections?.map(section => {
            return (
              <React.Fragment key={v4()}>
                <Text variant="h5">{section.name}</Text>
                <Grid container spacing={1}>
                  {section.components?.map(component => (
                    <Grid key={v4()} {...component.gridProps}>
                      <ComponentBuilder state={component} />
                    </Grid>
                  ))}
                </Grid>
              </React.Fragment>
            );
          })}
        </FormBuilder>
        {state?.type === 'Table' && <TableBuilder state={state} data={data} />}
      </>
    ),
  );
});
