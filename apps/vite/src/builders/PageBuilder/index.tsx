import React from 'react';
import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Container, Grid2 as Grid } from '@mui/material';
import { Text } from '@shared/frontend';
import { PageBuilder as PageBuilderState } from '@shared/types';
import { ComponentBuilder } from '../ComponentBuilder';
import { FormBuilder } from '../FormBuilder';
import { Outlet, useParams } from 'react-router-dom';
import { TableBuilder } from '../TableBuilder';
import { Modal, ModalBody, ModalContent } from '@nextui-org/react';
import { toJS } from 'mobx';

interface PageBuilderProps {
  state: PageBuilderState | undefined;
}

export const PageBuilder = observer((props: PageBuilderProps) => {
  const { state } = props;
  const params = useParams();
  console.log('params', params);

  if (state?.type === 'Outlet') {
    return <Outlet />;
  }
  console.log('state', toJS(state));
  if (state?.type === 'Form') {
    console.log('modal open?');
    return (
      <Modal isOpen={true}>
        <ModalContent>
          <ModalBody>sadasdsa</ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Container maxWidth="sm">
      {state?.form && (
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
      )}
      {state?.type === 'Table' && <TableBuilder state={state} />}
    </Container>
  );
});
