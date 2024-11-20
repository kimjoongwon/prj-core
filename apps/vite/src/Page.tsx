import { v4 } from 'uuid';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { BComponent, State } from '@shared/types';
import { FormValidator } from './FormValidator';
import { Grid2 as Grid, Stack } from '@mui/material';
import { ComponentManager, Text } from '@shared/frontend';

interface PageProps {
  children?: React.ReactNode;
  state: State;
}

export const Page = observer((props: PageProps) => {
  const { state: _state } = props;

  const state = useLocalObservable(() => ({ ..._state }));
  return (
    <form style={{ display: 'flex', padding: 10 }}>
      {state?.forms?.map(form => {
        return (
          <Stack spacing={2}>
            <Text variant="h5">{form.name}</Text>
            <Grid container spacing={2}>
              {form.components?.map((component, componentNo) => (
                <Grid key={v4()} {...component.gridProps}>
                  {component.validation ? (
                    <FormValidator
                      state={state}
                      componentNo={componentNo}
                      validation={component.validation}
                    >
                      <Component component={component} />
                    </FormValidator>
                  ) : (
                    <Component component={component} />
                  )}
                </Grid>
              ))}
            </Grid>
          </Stack>
        );
      })}
    </form>
  );
});

interface ComponentProps {
  component: BComponent;
}

const Component = observer((props: ComponentProps) => {
  const { component, ...rest } = props;
  const Component = ComponentManager[component.type];

  return (
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    /* @ts-expect-error */
    <Component
      {...rest}
      {...component.props}
      state={component.props}
      path="value"
    />
  );
});
