'use client';

import { observer } from 'mobx-react-lite';
import { Button } from '@heroui/react';
import { Route } from '@shared/types';
import { Plate } from '../../providers/App/AppProvider';
import { renderLucideIcon } from '../../utils/iconUtils';
import { VStack } from '../VStack';
import { useLocalObservable } from 'mobx-react-lite';
import { useMemo, useEffect } from 'react';

interface CollapsibleSidebarProps {
  routes: Route[];
}

export const CollapsibleSidebar = observer((props: CollapsibleSidebarProps) => {
  const { routes } = props;

  // Local state for collapsed/expanded with localStorage persistence
  const sidebarState = useLocalObservable(() => ({
    isCollapsed: false,
    toggle() {
      this.isCollapsed = !this.isCollapsed;
      // 상태를 localStorage에 저장
      localStorage.setItem(
        'sidebarCollapsed',
        JSON.stringify(this.isCollapsed),
      );
    },
    // localStorage에서 초기 상태 복원
    initialize() {
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('sidebarCollapsed');
          if (saved !== null) {
            this.isCollapsed = JSON.parse(saved);
          }
        } catch (error) {
          console.warn(
            'Failed to restore sidebar state from localStorage:',
            error,
          );
        }
      }
    },
  }));

  // 컴포넌트 마운트 시 localStorage에서 상태 복원
  useEffect(() => {
    sidebarState.initialize();
  }, []);

  const handleRouteClick = (route: Route) => {
    if (route.fullPath) {
      console.log(`Navigating to: ${route.fullPath}`);
      Plate.navigation.getNavigator().push(route.fullPath);
    }
  };

  // selectedDashboardRouteChildren의 부모 메뉴 정보 가져오기
  const parentMenuInfo = useMemo(() => {
    const dashboardRoute = Plate.navigation.getRouteByName('대시보드');
    if (!dashboardRoute?.children?.length) return null;

    // 현재 경로와 매칭되는 대시보드 자식 라우트 찾기 (선택된 대시보드 메뉴)
    const normalizedCurrentPath = Plate.navigation.currentFullPath;

    const selectedDashboardChild = dashboardRoute.children.find(child => {
      return normalizedCurrentPath.startsWith(child.fullPath);
    });

    if (selectedDashboardChild) {
      return {
        name: selectedDashboardChild.name,
        pathname: selectedDashboardChild.fullPath,
        icon: selectedDashboardChild.icon,
      };
    }

    // fallback: 대시보드 라우트 자체 사용
    return {
      name: dashboardRoute.name,
      pathname: dashboardRoute.fullPath,
      icon: dashboardRoute.icon,
    };
  }, [routes]);

  return (
    <div
      className={`flex flex-col h-full transition-all duration-300 ${
        sidebarState.isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Header with Parent Menu Info and Toggle */}
      <div
        className={`flex items-center p-3 bg-content2/50 ${
          sidebarState.isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!sidebarState.isCollapsed && parentMenuInfo && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {parentMenuInfo.icon && (
              <div className="flex-shrink-0">
                {renderLucideIcon(
                  parentMenuInfo.icon,
                  'w-4 h-4 text-primary',
                  16,
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {parentMenuInfo.name}
              </h3>
            </div>
          </div>
        )}

        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          onPress={sidebarState.toggle}
          className="text-default-500 hover:text-default-700 flex-shrink-0"
          aria-label={
            sidebarState.isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
          }
        >
          {renderLucideIcon(
            sidebarState.isCollapsed ? 'ChevronRight' : 'ChevronLeft',
            'w-4 h-4',
            16,
          )}
        </Button>
      </div>

      {/* Divider */}
      {!sidebarState.isCollapsed && parentMenuInfo && (
        <div className="px-3 py-2">
          <div className="w-full h-px"></div>
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3">
        {routes?.length > 0 ? (
          <VStack className="gap-1">
            {routes.map((route, index) => {
              const buttonContent = sidebarState.isCollapsed
                ? null
                : route.name || route.fullPath;

              return (
                <Button
                  variant="light"
                  color={route.active ? 'primary' : 'default'}
                  key={route.name || `route-${index}`}
                  onPress={() => handleRouteClick(route)}
                  className={`transition-all duration-200 ${
                    sidebarState.isCollapsed
                      ? 'justify-center items-center flex px-0 min-w-12 w-12 h-12 mx-auto'
                      : 'justify-start px-3 w-full'
                  } ${route.active ? 'bg-primary/10' : ''}`}
                  isIconOnly={sidebarState.isCollapsed}
                  startContent={
                    sidebarState.isCollapsed
                      ? undefined
                      : route.icon
                      ? renderLucideIcon(route.icon, 'w-4 h-4', 16)
                      : undefined
                  }
                  title={
                    sidebarState.isCollapsed
                      ? route.name || route.fullPath
                      : undefined
                  }
                >
                  {sidebarState.isCollapsed
                    ? route.icon
                      ? renderLucideIcon(route.icon, 'w-5 h-5', 20)
                      : renderLucideIcon('Circle', 'w-4 h-4', 16)
                    : buttonContent}
                </Button>
              );
            })}
          </VStack>
        ) : (
          !sidebarState.isCollapsed && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 mb-3 rounded-lg bg-default-100 flex items-center justify-center">
                {renderLucideIcon('FolderOpen', 'w-6 h-6 text-default-400', 24)}
              </div>
              <p className="text-sm text-default-500 mb-1">메뉴 없음</p>
              <p className="text-xs text-default-400">
                선택된 항목에 하위 메뉴가 없습니다
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
});

CollapsibleSidebar.displayName = 'CollapsibleSidebar';
