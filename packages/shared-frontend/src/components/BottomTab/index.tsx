'use client';

import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@heroui/react';
import { Route } from '@shared/types';
import { Plate } from '../../providers/App/AppProvider';
import { renderLucideIcon } from '../../utils/iconUtils';

export interface BottomTabProps {
  routes: Route[];
  className?: string;
  activeColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  inactiveColor?: 'default' | 'secondary';
  variant?: 'light' | 'solid' | 'bordered' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  iconSize?: number;
  onTabPress?: (route: Route) => void;
}

/**
 * BottomTab 컴포넌트
 * 모바일 환경에서 사용되는 하단 탭 네비게이션
 * Route 타입의 배열을 받아서 네비게이션 탭을 생성합니다.
 */
export const BottomTab = observer((props: BottomTabProps) => {
  const {
    routes,
    className = '',
    activeColor = 'primary',
    inactiveColor = 'default',
    variant = 'light',
    size = 'sm',
    showLabels = true,
    iconSize = 20,
    onTabPress,
  } = props;

  const state = useLocalObservable<{ activeParent: Route | null }>(() => ({
    activeParent: null,
  }));
  const handleChildPress = (route: Route) => {
    if (onTabPress) {
      onTabPress(route);
    }

    if (route.onClick) {
      route.onClick();
      state.activeParent = null;
      return;
    }

    if (route.pathname) {
      Plate.navigation.getNavigator().push(route.pathname);
    }

    state.activeParent = null;
  };

  const handleTabPress = (route: Route) => {
    if (route.children && route.children.length > 0) {
      state.activeParent = route;
      return;
    }
    // 커스텀 onTabPress 핸들러가 있으면 실행
    if (onTabPress) {
      onTabPress(route);
    }

    // route.onClick이 정의되어 있으면 실행
    if (route.onClick) {
      route.onClick();
      return;
    }

    // 기본 네비게이션 동작
    if (route.pathname) {
      Plate.navigation.getNavigator().push(route.pathname);
    }
  };

  // 탭이 활성화되어 있는지 확인
  const isTabActive = (route: Route): boolean => {
    return route.active || false;
  };

  // routes가 없거나 빈 배열이면 렌더링하지 않음
  if (!routes || routes.length === 0) {
    return null;
  }

  return (
    <div
      className={`
        flex justify-around items-center 
        bg-content1 border-divider
        px-2 py-1
        ${className}
      `}
    >
      {routes.map((route, index) => {
        const isActive = isTabActive(route);
        const buttonColor = isActive ? activeColor : inactiveColor;

        return (
          <Button
            key={route.name || route.pathname || `tab-${index}`}
            variant={variant}
            color={buttonColor}
            size={size}
            className={`
              flex-1 flex flex-col items-center justify-center
              min-w-0 max-w-24
              h-12
              ${isActive ? 'font-semibold' : 'font-normal'}
            `}
            onPress={() => handleTabPress(route)}
          >
            <div className="flex flex-col items-center justify-center gap-1">
              {/* 아이콘 렌더링 */}
              {route.icon && (
                <div
                  className={`
                  flex items-center justify-center
                  ${showLabels ? 'mb-0.5' : ''}
                `}
                >
                  {renderLucideIcon(
                    route.icon,
                    `w-${Math.ceil(iconSize / 4)} h-${Math.ceil(iconSize / 4)}`,
                    iconSize,
                  )}
                </div>
              )}

              {/* 라벨 렌더링 */}
              {showLabels && (
                <span
                  className={`
                  text-xs leading-none text-center
                  truncate max-w-full
                  ${isActive ? 'font-semibold' : 'font-normal'}
                `}
                >
                  {route.name || route.pathname}
                </span>
              )}
            </div>
          </Button>
        );
      })}
      {state.activeParent && (
        <Modal isOpen={true} onClose={() => (state.activeParent = null)} size="full">
          <ModalContent>
            {() => (
              <>
                <ModalHeader>{state.activeParent.name}</ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-3 gap-4 p-4">
                    {state.activeParent.children?.map((child, idx) => (
                      <Button
                        key={child.name || child.pathname || idx}
                        variant="light"
                        className="flex flex-col items-center justify-center gap-2 border rounded-lg py-3"
                        onPress={() => handleChildPress(child)}
                      >
                        {child.icon && (
                          <div className="flex items-center justify-center">
                            {renderLucideIcon(child.icon, 'w-6 h-6', iconSize)}
                          </div>
                        )}
                        <span className="text-sm text-center truncate">
                          {child.name || child.pathname}
                        </span>
                      </Button>
                    ))}
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
});

BottomTab.displayName = 'BottomTab';
