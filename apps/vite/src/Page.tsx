import {
  BottomTab,
  Button,
  HStack,
  Input,
  Logo,
  Paths,
  Route,
  useGetPages,
  VStack,
} from '@shared/frontend';
import { Link, useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { IButton, IInput, State } from '@shared/types';
import { toJS } from 'mobx';
import { FormValidator } from './FormValidator';
import { Grid2 as Grid } from '@mui/material';

interface PageProps {
  children?: React.ReactNode;
  state: State;
}

export const Page = observer((props: PageProps) => {
  const { state: _state } = props;

  const state = useLocalObservable(() => _state);

  return (
    <form>
      <Grid {...toJS(state.layout.gridProps)}>
        {state?.form?.elements?.map(element => {
          if (!element) {
            return <></>;
          }

          if (element?.input) {
            if (element.type === 'Input') {
              const input = element.input as IInput;
              return (
                <Grid key={v4()} {...toJS(element.gridProps)}>
                  <FormValidator state={element}>
                    <Input
                      type={input.type}
                      label={input.label}
                      state={input}
                      placeholder={input.placeholder}
                      path={'value'}
                    />
                  </FormValidator>
                </Grid>
              );
            }
          }

          if (element.type === 'Button') {
            const button = element.input as IButton;
            return (
              <Grid key={v4()} {...toJS(element.gridProps)}>
                <Button
                  color={button.color}
                  fullWidth={button?.fullWidth}
                  onClick={() => {
                    console.log('button.flow', button.flow);
                  }}
                >
                  {button.title}
                </Button>
              </Grid>
            );
          }
        })}
      </Grid>
    </form>
  );
});

interface LayoutProps {
  children?: React.ReactNode;
  layout: State['layout'];
}

export const Layout = observer((props: LayoutProps) => {
  const { children, layout } = props;
  const { data: getPagesResponse } = useGetPages();
  const pages = getPagesResponse?.data || [];
  const tabs: Route[] =
    pages.map(page => ({
      name: page.name,
      pathname: page.pathname as Paths,
    })) || [];
  const navigate = useNavigate();

  const state = useLocalObservable(() => ({
    currentTab: '',
  }));

  return (
    <VStack className="space-y-2 px-4">
      {layout.type === 'Auth' && <Logo variants={'text'} />}
      <HStack>
        {layout?.type === 'Main' &&
          pages?.map(page => (
            <Button
              key={page.pathname}
              as={Link}
              href={page.pathname}
              onClick={() => navigate(page.pathname)}
            >
              {page.pathname}
            </Button>
          ))}
      </HStack>
      {children}
      {layout.type === 'Main' && (
        <BottomTab tabs={tabs} state={state} path={'currentTab'} />
      )}
    </VStack>
  );
});
