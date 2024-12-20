import React from 'react';
import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Container, Grid2 as Grid } from '@mui/material';
import { APIManager, Text } from '@shared/frontend';
import { PageBuilder as PageBuilderState } from '@shared/types';
import { ComponentBuilder } from '../ComponentBuilder';
import { FormBuilder } from '../FormBuilder';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { TableBuilder } from '../TableBuilder';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { get, set } from 'lodash-es';

interface PageBuilderProps {
  state: PageBuilderState | undefined;
}

export const PageBuilder = observer((props: PageBuilderProps) => {
  const { state } = props;

  const navigate = useNavigate();
  const serviceId = window.location.pathname.split('/')[4];
  const pathParams = { ...useParams(), serviceId };

  // const payloadModel = cloneDeep(state?.query?.payload) || {};
  let payload = {};

  const isQueryExist =
    !!APIManager?.[state?.query?.name as keyof typeof APIManager];

  const queryParams = state?.query?.keysForConvertPathParamsToPayload?.map(
    item => {
      const value = get(pathParams, item.getKey);
      payload = set(payload, item.setKey, value);
    },
  );

  const getQuery = isQueryExist
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      APIManager?.[state?.query.name as keyof typeof APIManager](
        { ...state?.query, ...queryParams, serviceId },
        {
          query: {
            enabled: !!state?.query?.name,
          },
        },
      )
    : [];
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
