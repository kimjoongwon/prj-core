'use client';

import {
  AppBar,
  BottomTab,
  galaxy,
  useGetAllServiceSuspense,
} from '@shared/frontend';
import { observer } from 'mobx-react-lite';
interface MainLayoutProps {
  children: React.ReactNode;
}

const tabs = [
  { name: '앱', isVisible: true },
  { name: '세션', isVisible: true },
  { name: '예약', isVisible: true },
  { name: '공간', isVisible: true },
  { name: '회원', isVisible: true },
  { name: '권한', isVisible: true },
];

const MainLayout = observer((props: MainLayoutProps) => {
  const { children } = props;
  const getAllService = useGetAllServiceSuspense();
  const services = getAllService.data?.data;

  const tabs =
    services?.map(({ id: serviceId, label }) => ({
      name: label || '',
      isVisible: true,
      onClick: () => {
        galaxy.router.push({
          url: '/admin/main/services/:serviceId',
          params: { serviceId: serviceId },
        });
      },
    })) || [];

  return (
    <>
      <AppBar />
      {children}
      <BottomTab tabs={tabs} />
    </>
  );
});

export default MainLayout;
