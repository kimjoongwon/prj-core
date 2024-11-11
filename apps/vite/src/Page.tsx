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

/* eslint-disable @typescript-eslint/no-unused-vars */
interface Element {
  type: 'Input';
  path: string;
  validation: {
    timing: 'onBlur' | 'onChange' | 'onClick';
    required: boolean;
    message: string;
  };
}
interface Layout {
  type: 'Auth' | 'Empty' | 'Main';
}

export interface IPage {
  name: string;
  pathname: string;
  form: {
    name: string;
    elements: Element[];
  };
  children: IPage[];
  state: object;
  layout: Layout;
}

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
    <Layout type={page?.layout.type}>
      <Outlet />
      <Form
        buttonProps={{
          fullWidth: true,
          color: 'primary',
          children: page.form?.submit?.button?.title,
          onClick: async () => {
            let data = undefined;
            try {
              data = await APIManager[page.form?.submit?.button?.mutation](
                state.form,
              );
            } catch (error) {
              console.error(error);
            }
            if (data.httpStatus === 200) {
              navigate(
                page?.form?.submit?.button?.onSuccess?.navigate?.pathname,
              );
            }
          },
        }}
        name={page?.form?.name}
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
  type: Layout['type'];
}

export const Layout = observer((props: LayoutProps) => {
  const { children, type } = props;
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
      {type === 'Auth' && <Logo variants={'text'} />}
      <HStack>
        {type === 'Main' &&
          pages?.map(page => (
            <Button
              as={Link}
              href={page.pathname}
              onClick={() => navigate(page.pathname)}
            >
              {page.pathname}
            </Button>
          ))}
      </HStack>
      {children}
      {type === 'Main' && (
        <BottomTab tabs={tabs} state={state} path={'currentTab'} />
      )}
    </VStack>
  );
});
