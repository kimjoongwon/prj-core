import { ReactNode } from 'react';
import { LayoutBuilder as LayoutBuilderInterface } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router';
import { AuthLayout } from '../../layouts/Auth';
import { ModalLayout } from '../../layouts/Modal';
import { DashboardLayout } from '../../layouts/Dashboard';
import { Plate, useNavigation, useNavigator } from '../../../providers';
import { Navbar } from '../../inputs';
import { Header, CollapsibleSidebar } from '../../layouts';
import { Logo, DarkModeSwitch, Breadcrumb, Avatar } from '../../ui';
import { useEffect } from 'react';
import { reaction } from 'mobx';

interface Layout {
  children: ReactNode;
  layoutBuilder?: LayoutBuilderInterface;
}

type LayoutBuilderProps = Layout;

export const LayoutBuilder = observer((props: LayoutBuilderProps) => {
  const { children, layoutBuilder } = props;
  const { pushByName, push } = useNavigator();
  const navigation = useNavigation();

  // currentRoute 변경을 감지하여 네비게이션 수행
  useEffect(() => {
    const dispose = reaction(
      () => Plate.navigation.currentFullPath,
      currentRoute => {
        if (currentRoute) {
          console.log(`Navigation reaction: ${currentRoute}`);
          push(currentRoute);
        }
      },
    );

    return dispose;
  }, []);

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
    return <ModalLayout title={layoutBuilder.name}>{children}</ModalLayout>;
  }

  if (layoutBuilder?.type === 'Dashboard') {
    // Dashboard에서는 항상 dashboard의 자식 라우트들을 보여줌
    const dashboardRoutes = navigation.getDirectChildrenByName('대시보드');

    // 선택된 대시보드 라우트의 자식들을 leftSidebar에 표시
    const selectedDashboardRouteChildren =
      navigation.getSelectedDashboardRouteChildren();

    // parentMenuInfo를 navigation에서 계산
    const parentMenuInfo = navigation.getParentMenuInfo();

    return (
      <DashboardLayout
        header={
          <Header
            left={
              <Logo variants={'text'} onClick={() => pushByName('대시보드')} />
            }
            center={<Navbar routes={dashboardRoutes} />}
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
            <CollapsibleSidebar
              routes={selectedDashboardRouteChildren}
              parentMenuInfo={parentMenuInfo}
              path="currentFullPath"
              state={Plate.navigation}
            />
          )
        }
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
