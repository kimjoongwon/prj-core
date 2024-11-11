import {
  APIManager,
  BottomTab,
  Button,
  Form,
  HStack,
  Input,
  Logo,
  Paths,
  Route,
  useGetPages,
  VStack,
} from '@shared/frontend';
import { HTMLAttributes } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { IPage } from '@shared/types';

interface PageProps {
  children?: React.ReactNode;
  page: IPage;
}

interface ElementProps extends HTMLAttributes<unknown> {
  label: string;
  path: unknown;
  placeholder: string;
}

export const Page = (props: PageProps) => {
  const { page } = props;

  const state = useLocalObservable(() => page.state);
  const navigate = useNavigate();
  const ElementManager = {
    Input: (props: ElementProps) => (
      <Input
        key={v4()}
        label={props.label}
        state={state}
        placeholder={props.placeholder}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error'
        path={props.path}
      />
    ),
  };

  return (
    <Layout layout={page?.layout}>
      <Outlet />
      <Form
        buttonProps={{
          fullWidth: true,
          color: 'primary',
          children: page.form?.submitButton.title,
          onClick: async () => {
            let data = undefined;
            const mutationKey = page.form?.submitButton.mutationKey || '';
            if (page.form?.submitButton?.mutationKey) {
              try {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                data = await APIManager[mutationKey](state.form);
              } catch (error) {
                console.error(error);
              }
            }
            if (data.httpStatus === 200) {
              navigate({
                pathname:
                  page?.form?.submitButton?.onSuccess?.navigate?.pathname,
              });
            }
          },
        }}
        name={page?.form?.name || ''}
      >
        {props.page?.form?.elements?.map(element => {
          return ElementManager[element.type](
            element as unknown as ElementProps,
          );
        })}
      </Form>
    </Layout>
  );
};

interface LayoutProps {
  children?: React.ReactNode;
  layout: IPage['layout'];
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
        {layout.type === 'Main' &&
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
