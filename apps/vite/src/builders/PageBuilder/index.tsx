import React from 'react';
import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Container, Grid2 as Grid } from '@mui/material';
import { APIManager, Text } from '@shared/frontend';
import { PageBuilder as PageBuilderState } from '@shared/types';
import { ComponentBuilder } from '../ComponentBuilder';
import { FormBuilder } from '../FormBuilder';
import { Outlet, useNavigate } from 'react-router-dom';
import { TableBuilder } from '../TableBuilder';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';

interface PageBuilderProps {
  state: PageBuilderState | undefined;
}

export const PageBuilder = observer((props: PageBuilderProps) => {
  const { state } = props;
  const navigate = useNavigate();
  console.log('state?.apiKey', state?.apiKey);
  const serviceId = window.location.pathname.split('/')[4];
  const isQueryExist = !!APIManager?.[state?.apiKey as keyof typeof APIManager];
  const getQuery = isQueryExist
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      APIManager?.[state?.apiKey as keyof typeof APIManager](
        { ...state?.query, serviceId },
        {
          query: {
            enabled: !!state?.apiKey,
          },
        },
      )
    : [];
  console.log('getQuery', getQuery);
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

    return <Container maxWidth="sm">{children}</Container>;
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
