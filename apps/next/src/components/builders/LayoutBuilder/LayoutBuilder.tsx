import { ReactNode } from 'react';
import {
  AppBar,
  Button,
  HStack,
  Layout,
  List,
  VStack,
  Text,
} from '@shared/frontend';
import { LayoutBuilder as LayoutBuilderInterface } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import { v4 } from 'uuid';
import { PathUtil } from '@shared/utils';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spacer,
} from '@heroui/react';
interface Layout {
  children: ReactNode;
  layoutBuilder?: LayoutBuilderInterface;
}

type LayoutBuilderProps = Layout;
type ModalLayoutProps = Layout;
type DataGridLayoutProps = Layout;
type AuthLayoutProps = Layout;
type ServiceLayoutProps = Layout;
type ServicesLayoutProps = Layout;

export const LayoutBuilder = observer((props: LayoutBuilderProps) => {
  const { children, layoutBuilder } = props;

  // if (layoutBuilder?.type === 'Auth') {
  //   return <AuthLayout layoutBuilder={layoutBuilder}>{children}</AuthLayout>;
  // }

  // if (layoutBuilder?.type === 'Services') {
  //   return (
  //     <ServicesLayout layoutBuilder={layoutBuilder}>{children}</ServicesLayout>
  //   );
  // }

  // if (layoutBuilder?.type === 'Service') {
  //   return (
  //     <ServiceLayout layoutBuilder={layoutBuilder}>{children}</ServiceLayout>
  //   );
  // }

  // if (layoutBuilder?.type === 'DataGrid') {
  //   return (
  //     <DataGridLayout layoutBuilder={layoutBuilder}>{children}</DataGridLayout>
  //   );
  // }

  // if (layoutBuilder?.type === 'Modal') {
  //   return <ModalLayout layoutBuilder={layoutBuilder}>{children}</ModalLayout>;
  // }

  // if (!layoutBuilder) {
  //   return <Outlet />;
  // }

  return children;
});

// export const AuthLayout = observer((props: AuthLayoutProps) => {
//   const { children } = props;

//   return (
//     <>
//       <AppBar />
//       {children}
//     </>
//   );
// });

// export const ServiceLayout = observer((props: ServiceLayoutProps) => {
//   const { children } = props;
//   const store = useStore();
//   const navigate = useNavigate();

//   return (
//     <>
//       <div className="flex flex-col md:flex-row h-full flex-1 space-y-2 md:space-y-0 md:space-x-2 px-4 md:p-0">
//         <Card className="rounded-xl w-full md:w-[200px]">
//           <CardHeader>
//             <Text variant="h6">{store.navigation.serviceRoute?.name} </Text>
//           </CardHeader>
//           <Divider />
//           <CardBody>
//             <List
//               className="flex flex-row md:flex-col"
//               data={store.navigation.serviceRoute?.children || []}
//               renderItem={route => {
//                 return (
//                   <Button
//                     variant="light"
//                     key={v4()}
//                     color={route.active ? 'primary' : 'default'}
//                     onPress={() => {
//                       navigate(route.pathname);
//                       store.navigation.activateRoute();
//                     }}
//                   >
//                     {route.name}
//                   </Button>
//                 );
//               }}
//             />
//           </CardBody>
//         </Card>
//         {children}
//       </div>
//     </>
//   );
// });

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
