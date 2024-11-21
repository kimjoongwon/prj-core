import { v4 } from 'uuid';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { BButton, BComponent, State } from '@shared/types';
import { FormValidator } from './FormValidator';
import { Grid2 as Grid, Stack } from '@mui/material';
import { APIManager, Button, ComponentManager, Text } from '@shared/frontend';
import { Toast } from './toast';
import { isAxiosError } from 'axios';
import { toJS } from 'mobx';
import { store } from './main';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

interface PageProps {
  children?: React.ReactNode;
  state: State;
}

export const Page = observer((props: PageProps) => {
  const { state: _state } = props;
  const location = useLocation();
  const state = useLocalObservable(() => ({ ..._state }));

  console.log(location.pathname);
  return (
    <form style={{ display: 'flex', padding: 10 }}>
      <div>{location.pathname}</div>
      {state?.forms?.map(form => {
        return (
          <>
            <Stack key={v4()} spacing={2}>
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
                        <Component state={state} component={component} />
                      </FormValidator>
                    ) : (
                      <Component state={state} component={component} />
                    )}
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </>
        );
      })}
    </form>
  );
});

interface ComponentProps {
  state: State;
  component: BComponent;
}

const Component = observer((props: ComponentProps) => {
  const navigate = useNavigate();
  const { component, state, ...rest } = props;
  const Component = ComponentManager[component.type];

  if (component.type === 'Button') {
    const onClick = async () => {
      const props = component.props as BButton;
      try {
        if (props.flow.mutation) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          await APIManager[props.flow.mutation](toJS(state.payload));
        }
        if (props.flow.try.message) {
          store.snackbar.open = true;
          store.snackbar.message = props.flow.try.message;
        }

        if (props.flow.try.pathname) {
          console.log('가니?', props.flow.try.pathname);
          navigate(props.flow.try.pathname);
        }
      } catch (error: unknown) {
        if (isAxiosError(error) && props.flow.catch) {
          const errorMessage = error.response?.data?.message;
          if (props.flow) {
            store.snackbar.open = true;
            store.snackbar.message = errorMessage || props.flow.catch.message;
            if (props.flow.catch.pathname) {
              navigate(props.flow.catch.pathname);
            }
          }
        }
      } finally {
        if (props.flow.finally) {
          Toast.show(props.flow.finally.message);
        }
      }
    };

    return <Button {...component.props} onClick={onClick} />;
  }

  return (
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    /* @ts-expect-error */
    <Component {...rest} {...component.props} state={state} />
  );
});
