import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Container, Grid2 as Grid } from '@mui/material';
import { APIManager, DataGrid, Text } from '@shared/frontend';
import { PageBuilder as PageBuilderState } from '@shared/types';
import { ComponentBuilder } from '../ComponentBuilder';
import { FormBuilder } from '../FormBuilder';
import { Outlet } from 'react-router-dom';

interface PageBuilderProps {
  state: PageBuilderState | undefined;
}

export const PageBuilder = observer((props: PageBuilderProps) => {
  const { state } = props;
  console.log(state);
  let items = [];
  if (state?.type === 'Table') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { data: response } = APIManager[state?.table?.queryKey](
      state?.table?.query || {},
      {
        query: {
          enabled: !!state?.table?.queryKey,
        },
      },
    );

    items = response?.data || [];
  }

  if (state?.type === 'Outlet') {
    return <Outlet />;
  }

  if (state?.type === 'Table') {
    return (
      <Container maxWidth="sm">
        <DataGrid data={items} columns={state.table?.columns || []} />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      {state?.form && (
        <FormBuilder state={state.form!}>
          {state?.form?.sections?.map(section => {
            return (
              <>
                <Text variant="h5">{section.name}</Text>
                <Grid container spacing={1}>
                  {section.components?.map(component => (
                    <Grid key={v4()} {...component.gridProps}>
                      <ComponentBuilder state={component} />
                    </Grid>
                  ))}
                </Grid>
              </>
            );
          })}
        </FormBuilder>
      )}
    </Container>
  );
});
