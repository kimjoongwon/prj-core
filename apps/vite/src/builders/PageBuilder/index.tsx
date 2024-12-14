import React from 'react';
import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Container, Grid2 as Grid } from '@mui/material';
import { Text } from '@shared/frontend';
import { PageBuilder as PageBuilderState } from '@shared/types';
import { ComponentBuilder } from '../ComponentBuilder';
import { FormBuilder } from '../FormBuilder';
import { Outlet } from 'react-router-dom';
import { TableBuilder } from '../TableBuilder';

interface PageBuilderProps {
  state: PageBuilderState | undefined;
}

export const PageBuilder = observer((props: PageBuilderProps) => {
  const { state } = props;

  if (state?.type === 'Outlet') {
    return <Outlet />;
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
