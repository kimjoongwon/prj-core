import { ReactNode } from 'react';
import { Button, Layout, List, Plate, Text } from '@shared/frontend';
import { LayoutBuilder as LayoutBuilderInterface } from '@shared/specs';
import { observer } from 'mobx-react-lite';
import { Outlet, useNavigate } from 'react-router';
import { Card, CardHeader, Divider, CardBody } from '@heroui/react';
import { v4 } from 'uuid';
interface Layout {
  children: ReactNode;
  layoutBuilder?: LayoutBuilderInterface;
}

type LayoutBuilderProps = Layout;

export const LayoutBuilder = observer((props: LayoutBuilderProps) => {
  const { children, layoutBuilder } = props;

  if (layoutBuilder?.type === 'Root') {
    return (
      <div>
        <Outlet />
      </div>
    );
  }

  if (layoutBuilder?.type === 'Auth') {
    return (
      <AuthLayout formComponent={<Outlet />} adComponent={<div>haha</div>} />
    );
  }

  return children;
});

export const AuthLayout = observer(
  (props: { formComponent?: ReactNode; adComponent?: ReactNode }) => {
    const { formComponent, adComponent } = props;

    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col md:flex-row flex-1 w-full">
          {/* Mobile */}
          <div className="flex flex-col w-full md:hidden">
            <div className="flex-1 p-6">{formComponent}</div>
          </div>
          {/* Desktop */}
          <div className="hidden md:flex flex-1 flex-row w-full">
            <div className="flex-1 flex items-center justify-center p-10">
              <div className="w-full max-w-md">{formComponent}</div>
            </div>
            <div className="flex-1 flex items-center justify-center p-10">
              <div className="w-full max-w-md">{adComponent}</div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export const DashboardLayout = observer((props: { children: ReactNode }) => {
  const { children } = props;
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col md:flex-row h-full flex-1 space-y-2 md:space-y-0 md:space-x-2 px-4 md:p-0">
        <Card className="rounded-xl w-full md:w-[200px]">
          <CardHeader>
            <Text variant="h6">{Plate.navigation.serviceRoute?.name} </Text>
          </CardHeader>
          <Divider />
          <CardBody>
            <List
              className="flex flex-row md:flex-col"
              data={Plate.navigation.serviceRoute?.children || []}
              renderItem={route => {
                return (
                  <Button
                    variant="light"
                    key={v4()}
                    color={route.active ? 'primary' : 'default'}
                    onPress={() => {
                      navigate(route.pathname);
                      Plate.navigation.activateRoute(route.pathname);
                    }}
                  >
                    {route.name}
                  </Button>
                );
              }}
            />
          </CardBody>
        </Card>
        {children}
      </div>
    </>
  );
});

// export const ServicesLayout = observer((props: ServicesLayoutProps) => {
//   const { children } = props;

//   return (
//     <VStack className="flex-1 w-full">
//       <AppBar content={<ServicesRoutes />} />
//       <Spacer y={1} />
//       {children}
//       <Card className="relative bottom-0 w-full flex sm:hidden h-[64px] justify-center items-center rounded-t-none rounded-b-none">
//         <ServicesRoutes />
//       </Card>
//     </VStack>
//   );
// });

// export const DataGridLayout = observer((props: DataGridLayoutProps) => {
//   const { children, layoutBuilder } = props;

//   return (
//     <Card className="flex-1 flex-col">
//       <CardHeader>
//         <Text variant="h6">{layoutBuilder?.page?.name}</Text>
//       </CardHeader>
//       <Divider />
//       <CardBody className="flex flex-1 flex-col space-y-2">{children}</CardBody>
//       <Outlet />
//     </Card>
//   );
// });

// export const ModalLayout = observer((props: ModalLayoutProps) => {
//   const { children, layoutBuilder } = props;
//   const navigate = useNavigate();

//   return (
//     <Modal
//       size="full"
//       isOpen={true}
//       isDismissable
//       onClose={() => navigate(-1)}
//       scrollBehavior="inside"
//     >
//       <ModalContent>
//         <ModalHeader>{layoutBuilder?.page?.name}</ModalHeader>
//         <ModalBody>{children}</ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// });

// export const ServicesRoutes = observer(() => {
//   const { navigation } = useStore();
//   const navigate = useNavigate();

//   return (
//     <HStack className="justify-center">
//       {navigation.servicesRoute?.children?.map(route => {
//         return (
//           <Button
//             key={route.pathname}
//             variant="light"
//             color={route.active ? 'primary' : 'default'}
//             onPress={action(() => {
//               navigate(
//                 PathUtil.getUrlWithParamsAndQueryString(
//                   route.pathname + '/categories',
//                   route.params,
//                 ),
//               );
//               navigation.activateRoute();
//             })}
//           >
//             {route.name}
//           </Button>
//         );
//       })}
//     </HStack>
//   );
// });
