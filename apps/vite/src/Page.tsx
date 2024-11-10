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
// const ElementManager = {
//   Input: () => (
//     <Input
//       state={{
//         value: 'test',
//       }}
//       path={'value'}
//     />
//   ),
// };
export const Page = (_: PageProps) => {
  // const { queryKey, elements = [] } = props;
  // const { data: response } = APIManager?.[queryKey]?.({});

  return (
    <div>
      <Layout />
      {/* {props.elements?.map(element => ElementManager[element.type]())} */}
      {/* <DataGrid
        data={data || []}
        columns={[
          {
            header: 'ID',
          },
        ]}
      />
      {props.pathname} */}
    </div>
  );
};

export const Layout = () => {
  // const navigate = useNavigate();
  // const { data: getPagesByQueryResponse } = APIManager.useGetPagesByQuery({});
  // const pages = getPagesByQueryResponse?.data;

  return (
    <>
      {/* {pages?.map(page => (
        <Button
          as={Link}
          href={page.pathname}
          onClick={() => navigate(page.pathname)}
        >
          {page.pathname}
        </Button>
      ))} */}
    </>
  );
};
