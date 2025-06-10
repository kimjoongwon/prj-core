'use client';

import { observer } from 'mobx-react-lite';
import { Button } from '@heroui/react';
import { Route } from '@shared/types';
import { Plate } from '../../providers/App/AppProvider';
import { renderLucideIcon } from '../../utils/iconUtils';
import { VStack } from '../VStack';
import { useLocalObservable } from 'mobx-react-lite';
import { useMemo } from 'react';

interface CollapsibleSidebarProps {
  routes: Route[];
}

export const CollapsibleSidebar = observer((props: CollapsibleSidebarProps) => {
  const { routes } = props;

  // Local state for collapsed/expanded
  const sidebarState = useLocalObservable(() => ({
    isCollapsed: false,
    toggle() {
      this.isCollapsed = !this.isCollapsed;
    },
  }));

  const handleRouteClick = (route: Route) => {
    if (route.pathname) {
      Plate.navigation.getNavigator().push(route.pathname);
    }
  }; // selectedDashboardRouteChildren의 부모 메뉴 정보 가져오기
  const parentMenuInfo = useMemo(() => {
    // selectedDashboardRoute에서 직접 부모 정보 가져오기
    const selectedDashboardRoute = Plate.navigation.selectedDashboardRoute;

    if (!selectedDashboardRoute) return null;

    return {
      name: selectedDashboardRoute.name,
      pathname: selectedDashboardRoute.pathname,
      icon: selectedDashboardRoute.icon,
    };
  }, [Plate.navigation.selectedDashboardRoute]);

  return (
    <div
      className={`flex flex-col h-full transition-all duration-300 ${
        sidebarState.isCollapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Header with Parent Menu Info and Toggle */}
      <div className="flex items-center justify-between p-3 bg-content2/50">
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
                : route.name || route.pathname;

              return (
                <Button
                  variant="light"
                  color={route.active ? 'primary' : 'default'}
                  key={route.name || `route-${index}`}
                  onPress={() => handleRouteClick(route)}
                  className={`transition-all duration-200 ${
                    sidebarState.isCollapsed
                      ? 'justify-center items-center px-0 min-w-12 w-12 h-12'
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
                      ? route.name || route.pathname
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
