import { Button, Input, useGetPages } from '@shared/frontend';
import { Link, Outlet, useNavigate } from 'react-router-dom';

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

export interface IPage {
  name: string;
  pathname: string;
  elements: Element[];
  children: IPage[];
}

interface PageProps {
  children?: React.ReactNode;
  page?: IPage;
}
const ElementManager = {
  Input: props => (
    <Input
      label={props.label}
      state={{
        value: 'test',
      }}
      path={'value'}
    />
  ),
};
export const Page = (props: PageProps) => {
  const { page } = props;
  console.log('page', page);

  return (
    <div>
      <Layout />
      <Outlet />
      {props.page?.elements?.map(element =>
        ElementManager[element.type]({
          label: element.label,
        }),
      )}
    </div>
  );
};

export const Layout = () => {
  const { data: getPagesResponse } = useGetPages();
  const pages = getPagesResponse?.data || [];
  const navigate = useNavigate();

  return (
    <>
      {pages?.map(page => (
        <Button
          as={Link}
          href={page.pathname}
          onClick={() => navigate(page.pathname)}
        >
          {page.pathname}
        </Button>
      ))}
    </>
  );
};
