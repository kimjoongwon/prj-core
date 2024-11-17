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
import { State } from '@shared/types';
import { reaction, toJS } from 'mobx';
import { FormValidator } from './FormValidator';
import { Grid2 } from '@mui/material';

interface PageProps {
  children?: React.ReactNode;
  state: State;
}

let state: State | null = null;

reaction(
  () => JSON.stringify(state),
  () => console.log(toJS(state)),
);

export const Page = observer((props: PageProps) => {
  const { state: _state } = props;

  state = useLocalObservable(() => _state);

  const style = toJS(state.layout.style);
  return (
    <Grid2 container>
      {state?.form?.elements?.map(element => {
        if (!element) {
          return <></>;
        }
        if (element.type === 'Spacer') {
          return <div style={toJS(element.style)} />;
        }

        if (element?.input) {
          if (element.type === 'Input') {
            return (
              <div style={toJS(element.style)}>
                <FormValidator key={v4()} state={element}>
                  <Input
                    type={element.input.type}
                    label={element.input.label}
                    state={element.input}
                    placeholder={element.input.placeholder}
                    path={'value'}
                  />
                </FormValidator>
              </div>
            );
          }
        }
      })}
    </Grid2>
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
