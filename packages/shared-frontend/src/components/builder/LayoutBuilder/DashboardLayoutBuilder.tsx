import { ReactNode, useEffect } from 'react';
import { LayoutBuilder as LayoutBuilderInterface } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { reaction } from 'mobx';
import { Outlet } from 'react-router';
import { DashboardLayout } from '../../layout/DashboardLayout';
import { Header, CollapsibleSidebar } from '../../layout';
import { useNavigation } from '../../../provider';
import { Navbar } from '../../inputs';
import { Logo, DarkModeSwitch, Breadcrumb, Avatar } from '../../ui';
import { TenantAutoComplete } from '../../widgets';

interface DashboardLayoutBuilderProps {
  children: ReactNode;
  layoutBuilder?: LayoutBuilderInterface;
}

export const DashboardLayoutBuilder = observer(
  (props: DashboardLayoutBuilderProps) => {
    const navigation = useNavigation();
    const navigator = navigation.getNavigator();

    // currentFullPath가 변경되면 해당 경로로 이동하는 reaction 설정
    useEffect(() => {
      const dispose = reaction(
        () => navigation.currentFullPath,
        currentFullPath => {
          if (currentFullPath && currentFullPath.split('/').length < 6) {
            navigation.navigateToRouteOrFirstChildByPath(currentFullPath);
          }
        },
      );

      // 컴포넌트 언마운트 시 reaction 해제
      return () => dispose();
    }, [navigation, navigator]);

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
              <Logo
                variants={'text'}
                onClick={() => navigator.pushByName('대시보드')}
              />
            }
            center={<Navbar routes={dashboardRoutes} />}
            right={
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  <TenantAutoComplete />
                </div>
                <div className="flex-shrink-0">
                  <Avatar />
                </div>
                <div className="flex-shrink-0">
                  <DarkModeSwitch position="inline" size="sm" />
                </div>
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
              state={navigation}
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
  },
);
