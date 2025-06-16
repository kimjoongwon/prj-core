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
import { Plate } from '../../../../';
import { renderLucideIcon } from '../../../utils/iconUtils';

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

    if (route.fullPath) {
      Plate.navigation.getNavigator().push(route.fullPath);
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
    if (route.fullPath) {
      Plate.navigation.getNavigator().push(route.fullPath);
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
            key={route.name || route.fullPath || `tab-${index}`}
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
                  {route.name || route.fullPath}
                </span>
              )}
            </div>
          </Button>
        );
      })}
      {state.activeParent && (
        <Modal
          isOpen={true}
          onClose={() => (state.activeParent = null)}
          size="full"
          hideCloseButton={true}
        >
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex items-center justify-between p-4 border-b border-divider bg-content1">
                  {/* 뒤로가기 버튼 */}
                  {/* <Button
                    isIconOnly
                    variant="light"
                    size="lg"
                    className="text-default-600 hover:text-default-800"
                    onPress={() => (state.activeParent = null)}
                  >
                    {renderLucideIcon('ChevronLeft', 'w-6 h-6', 24)}
                  </Button> */}

                  {/* 메뉴 타이틀 */}
                  <h2 className="text-lg font-bold text-foreground flex-1 text-center">
                    {state.activeParent.name}
                  </h2>

                  {/* X 버튼 (모바일 친화적 크기) */}
                  <Button
                    isIconOnly
                    variant="light"
                    size="lg"
                    className="text-default-600 hover:text-default-800 min-w-12 h-12"
                    onPress={() => (state.activeParent = null)}
                  >
                    {renderLucideIcon('X', 'w-6 h-6', 24)}
                  </Button>
                </ModalHeader>
                <ModalBody className="p-0">
                  <div className="grid grid-cols-2 gap-4 p-6 pt-4">
                    {state.activeParent.children?.map((child, idx) => {
                      // 다양한 색상 스킴 배열
                      const colorSchemes = [
                        {
                          bg: 'from-blue-50 to-blue-100',
                          hoverBg: 'hover:from-blue-100 hover:to-blue-200',
                          border: 'border-blue-200/50',
                          iconBg: 'bg-blue-500/10',
                          iconBorder: 'border-blue-300/30',
                          iconColor: 'text-blue-600',
                          textColor: 'text-blue-800',
                        },
                        {
                          bg: 'from-emerald-50 to-emerald-100',
                          hoverBg:
                            'hover:from-emerald-100 hover:to-emerald-200',
                          border: 'border-emerald-200/50',
                          iconBg: 'bg-emerald-500/10',
                          iconBorder: 'border-emerald-300/30',
                          iconColor: 'text-emerald-600',
                          textColor: 'text-emerald-800',
                        },
                        {
                          bg: 'from-purple-50 to-purple-100',
                          hoverBg: 'hover:from-purple-100 hover:to-purple-200',
                          border: 'border-purple-200/50',
                          iconBg: 'bg-purple-500/10',
                          iconBorder: 'border-purple-300/30',
                          iconColor: 'text-purple-600',
                          textColor: 'text-purple-800',
                        },
                        {
                          bg: 'from-orange-50 to-orange-100',
                          hoverBg: 'hover:from-orange-100 hover:to-orange-200',
                          border: 'border-orange-200/50',
                          iconBg: 'bg-orange-500/10',
                          iconBorder: 'border-orange-300/30',
                          iconColor: 'text-orange-600',
                          textColor: 'text-orange-800',
                        },
                        {
                          bg: 'from-pink-50 to-pink-100',
                          hoverBg: 'hover:from-pink-100 hover:to-pink-200',
                          border: 'border-pink-200/50',
                          iconBg: 'bg-pink-500/10',
                          iconBorder: 'border-pink-300/30',
                          iconColor: 'text-pink-600',
                          textColor: 'text-pink-800',
                        },
                        {
                          bg: 'from-teal-50 to-teal-100',
                          hoverBg: 'hover:from-teal-100 hover:to-teal-200',
                          border: 'border-teal-200/50',
                          iconBg: 'bg-teal-500/10',
                          iconBorder: 'border-teal-300/30',
                          iconColor: 'text-teal-600',
                          textColor: 'text-teal-800',
                        },
                      ];

                      // 인덱스에 따라 색상 스킴 선택 (순환)
                      const colorScheme =
                        colorSchemes[idx % colorSchemes.length];

                      return (
                        <Button
                          key={child.name || child.fullPath || idx}
                          variant="flat"
                          className={`
                            flex flex-col items-center justify-center 
                            gap-3 p-6 h-32
                            bg-gradient-to-br ${colorScheme.bg}
                            ${colorScheme.hoverBg}
                            border-2 ${colorScheme.border}
                            rounded-2xl shadow-lg hover:shadow-xl
                            transition-all duration-300 ease-out
                            transform hover:scale-[1.02]
                            backdrop-blur-sm
                          `}
                          onPress={() => handleChildPress(child)}
                        >
                          {child.icon && (
                            <div
                              className={`
                                flex items-center justify-center
                                w-12 h-12 rounded-xl
                                ${colorScheme.iconBg} border ${colorScheme.iconBorder}
                                shadow-inner
                              `}
                            >
                              {renderLucideIcon(
                                child.icon,
                                `w-7 h-7 ${colorScheme.iconColor}`,
                                28,
                              )}
                            </div>
                          )}
                          <span
                            className={`
                              text-sm font-semibold text-center
                              ${colorScheme.textColor} leading-tight
                              max-w-full px-1
                            `}
                          >
                            {child.name || child.fullPath}
                          </span>
                        </Button>
                      );
                    })}
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
