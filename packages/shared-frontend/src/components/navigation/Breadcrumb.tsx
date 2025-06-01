import React from 'react';
import { Route } from '@shared/specs';
import { useGlobalNavigation } from '../../hooks/useUnifiedNavigation';

interface BreadcrumbItem {
  name: string;
  pathname?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[] | Route[];
  separator?: string | React.ReactNode;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  separatorClassName?: string;
  maxItems?: number;
  showHomeIcon?: boolean;
  homeRouteName?: string;
  onItemClick?: (item: BreadcrumbItem | Route) => void;
}

/**
 * 브레드크럼 컴포넌트
 * items prop이 없으면 현재 경로의 브레드크럼을 자동으로 생성합니다.
 */
export function Breadcrumb({
  items,
  separator = '/',
  className = '',
  itemClassName = '',
  activeItemClassName = '',
  separatorClassName = '',
  maxItems,
  showHomeIcon = false,
  homeRouteName = '홈',
  onItemClick,
}: BreadcrumbProps) {
  const { breadcrumbs, navigateByName, getPathByName } = useGlobalNavigation();

  // items가 제공되지 않으면 자동으로 현재 경로의 브레드크럼 사용
  const breadcrumbItems = items || breadcrumbs;

  // maxItems가 설정된 경우 아이템 수 제한
  const displayItems = maxItems
    ? breadcrumbItems.slice(-maxItems)
    : breadcrumbItems;

  const handleItemClick = (item: BreadcrumbItem | Route) => {
    onItemClick?.(item);

    // pathname이 있으면 해당 경로로 이동
    if (item.pathname && !item.active) {
      navigateByName(item.name);
    }
  };

  const handleHomeClick = () => {
    const homePath = getPathByName(homeRouteName);
    if (homePath) {
      navigateByName(homeRouteName);
    }
  };

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <nav className={`breadcrumb ${className}`} aria-label="breadcrumb">
      <ol className="flex items-center space-x-2">
        {/* 홈 아이콘 표시 */}
        {showHomeIcon && (
          <>
            <li>
              <button
                onClick={handleHomeClick}
                className={`breadcrumb-home ${itemClassName}`}
                aria-label="홈으로 이동"
              >
                🏠
              </button>
            </li>
            {displayItems.length > 0 && (
              <li className={`breadcrumb-separator ${separatorClassName}`}>
                {separator}
              </li>
            )}
          </>
        )}

        {/* maxItems 제한으로 인해 생략된 항목이 있을 때 표시 */}
        {maxItems && breadcrumbItems.length > maxItems && (
          <>
            <li className={`breadcrumb-ellipsis ${itemClassName}`}>...</li>
            <li className={`breadcrumb-separator ${separatorClassName}`}>
              {separator}
            </li>
          </>
        )}

        {/* 브레드크럼 아이템들 */}
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isClickable = item.pathname && !item.active && !isLast;

          return (
            <React.Fragment key={`${item.name}-${index}`}>
              <li>
                {isClickable ? (
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`breadcrumb-item ${itemClassName} hover:underline text-blue-600`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <span
                    className={`breadcrumb-item ${itemClassName} ${
                      isLast || item.active ? activeItemClassName : ''
                    } ${isLast ? 'text-gray-500 font-semibold' : ''}`}
                  >
                    {item.name}
                  </span>
                )}
              </li>

              {/* 마지막 아이템이 아닐 때 구분자 표시 */}
              {!isLast && (
                <li
                  className={`breadcrumb-separator ${separatorClassName} text-gray-400`}
                >
                  {separator}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

interface BreadcrumbBuilderProps {
  routeNames: string[];
  separator?: string | React.ReactNode;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
}

/**
 * 라우트 이름 배열로 브레드크럼을 생성하는 컴포넌트
 */
export function BreadcrumbBuilder({
  routeNames,
  separator = '/',
  className = '',
  itemClassName = '',
  activeItemClassName = '',
}: BreadcrumbBuilderProps) {
  const { getPathByName } = useGlobalNavigation();

  // 라우트 이름들을 브레드크럼 아이템으로 변환
  const items: BreadcrumbItem[] = routeNames.map((routeName, index) => {
    const pathname = getPathByName(routeName);
    const isLast = index === routeNames.length - 1;

    return {
      name: routeName,
      pathname,
      active: isLast,
    };
  });

  return (
    <Breadcrumb
      items={items}
      separator={separator}
      className={className}
      itemClassName={itemClassName}
      activeItemClassName={activeItemClassName}
    />
  );
}

// 스타일링을 위한 기본 CSS 클래스 정의 (Tailwind CSS 기준)
export const breadcrumbStyles = {
  container: 'flex items-center space-x-1 text-sm text-gray-600',
  item: 'hover:text-gray-900 transition-colors',
  activeItem: 'text-gray-900 font-medium',
  separator: 'text-gray-400',
  clickableItem:
    'text-blue-600 hover:text-blue-800 hover:underline cursor-pointer',
};
