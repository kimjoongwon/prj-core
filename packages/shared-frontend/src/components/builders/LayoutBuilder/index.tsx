import { ReactNode } from 'react';
import { LayoutBuilder as LayoutBuilderInterface } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router';
import { AuthLayout } from '../../layouts/Auth';
import { ModalLayout } from '../../layouts/Modal';
import { DashboardLayout } from '../../layouts/Dashboard';
import { Header } from '../../Header';
import { Navbar } from '../../Navbar';
import { Plate } from '../../../providers';
import { useSmartRoutes } from '../../../hooks/useRoutes';

interface Layout {
  children: ReactNode;
  layoutBuilder?: LayoutBuilderInterface;
}

type LayoutBuilderProps = Layout;

export const LayoutBuilder = observer((props: LayoutBuilderProps) => {
  const { children, layoutBuilder } = props;

  if (layoutBuilder?.type === 'Auth') {
    return (
      <AuthLayout
        formComponent={<Outlet />}
        adImageSrc="/ad.png"
        adImageAlt="Advertisement"
      />
    );
  }

  if (layoutBuilder?.type === 'Modal') {
    return (
      <ModalLayout>
        {children}
        <Outlet />
      </ModalLayout>
    );
  }

  if (layoutBuilder?.type === 'Dashboard') {
    // Dashboard에서는 항상 dashboard의 자식 라우트들을 보여줌
    const dashboardRoutes = Plate.navigation.getRoutesByPathname('dashboard');

    return (
      <DashboardLayout
        headerComponent={
          <Header
            centerComponent={<Navbar routes={dashboardRoutes} />}
            drawerComponent={
              <Navbar routes={dashboardRoutes} direction="vertical" />
            }
          />
        }
        leftSidebarComponent={<Navbar direction="vertical" routes={[]} />}
      >
        {children}
        <Outlet />
      </DashboardLayout>
    );
  }

  return (
    <>
      <Outlet />
      {children}
    </>
  );
});
