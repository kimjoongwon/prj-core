import { ReactNode } from 'react';
import { LayoutBuilder as LayoutBuilderInterface } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router';
import { AuthLayout } from '../../layouts/Auth';
import { ModalLayout } from '../../layouts/Modal';
import { DashboardLayout } from '../../layouts/Dashboard';
import { Header } from '../../Header';
import { Navbar } from '../../Navbar';
import { CollapsibleSidebar } from '../../CollapsibleSidebar';
import { Breadcrumb } from '../../Breadcrumb';
import { Plate } from '../../../providers';
import { BottomTab } from '../../BottomTab';
import { Logo } from '../../Logo';
import { Avatar } from '../../Avatar';
import { DarkModeSwitch } from '../../DarkModeSwitch';
import { DesktopOnly } from '../../ResponsiveVisibility';

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
      <ModalLayout title={'타이틀'}>
        {children}
        <Outlet />
      </ModalLayout>
    );
  }

  if (layoutBuilder?.type === 'Dashboard') {
    // Dashboard에서는 항상 dashboard의 자식 라우트들을 보여줌
    const dashboardRoutes =
      Plate.navigation.getDirectChildrenByName('대시보드');

    // 선택된 대시보드 라우트의 자식들을 leftSidebar에 표시
    const selectedDashboardRouteChildren =
      Plate.navigation.getSelectedDashboardRouteChildren();
    console.log('selectedDashboardRouteChildren', dashboardRoutes);
    return (
      <DashboardLayout
        header={
          <Header
            left={
              <Logo
                variants={'text'}
                onClick={() =>
                  Plate.navigation.getNavigator().pushByName('대시보드')
                }
              />
            }
            center={
              <div className="hidden xl:block">
                <Navbar routes={dashboardRoutes} />
              </div>
            }
            right={
              <div className="flex items-center gap-2">
                <Avatar />
                <DarkModeSwitch position="inline" size="sm" />
              </div>
            }
          />
        }
        leftSidebar={
          selectedDashboardRouteChildren.length > 0 && (
            <CollapsibleSidebar routes={selectedDashboardRouteChildren} />
          )
        }
        bottom={<BottomTab routes={dashboardRoutes} activeColor="primary" />}
        breadcrumb={
          <Breadcrumb
            showHomeIcon={true}
            homeRouteName="대시보드"
            maxItems={4}
            className="text-sm sm:text-base"
          />
        }
      >
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
