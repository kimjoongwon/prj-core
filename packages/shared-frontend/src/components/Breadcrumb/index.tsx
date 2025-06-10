'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router';
import type { BreadcrumbItem, BreadcrumbProps, BreadcrumbBuilderProps, Route } from '@shared/types';
import { Plate } from '../../providers/App/AppProvider';

/**
 * Breadcrumb component
 * If no items prop is provided, breadcrumbs are automatically
 * generated from the current location using the global navigation service.
 */
export const Breadcrumb = observer((props: BreadcrumbProps) => {
  const {
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
  } = props;

  const location = useLocation();

  const breadcrumbItems = React.useMemo<BreadcrumbItem[]>(() => {
    if (items) return items;
    return Plate.navigation.getBreadcrumbPath(location.pathname);
  }, [items, location.pathname]);

  const navigateByName = React.useCallback(
    (name: string, params?: object, search?: Record<string, string>) => {
      Plate.navigation.pushByName(name, params, search);
    },
    [],
  );

  const getPathByName = React.useCallback((name: string) => {
    return Plate.navigation.getPathByName(name);
  }, []);

  const displayItems = React.useMemo(() => {
    if (!maxItems) return breadcrumbItems;
    return breadcrumbItems.slice(-maxItems);
  }, [breadcrumbItems, maxItems]);

  const handleItemClick = (item: BreadcrumbItem | Route) => {
    onItemClick?.(item);
    if ('pathname' in item && item.pathname && !('active' in item && item.active)) {
      Plate.navigation.push(item.pathname);
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
    <nav
      className={`overflow-x-auto whitespace-nowrap ${className}`}
      aria-label="breadcrumb"
    >
      <ol className="flex items-center text-sm">
        {showHomeIcon && (
          <>
            <li>
              <button
                onClick={handleHomeClick}
                className={`px-1 ${itemClassName}`}
                aria-label="홈으로 이동"
              >
                🏠
              </button>
            </li>
            {displayItems.length > 0 && (
              <li className={`mx-1 ${separatorClassName}`}>{separator}</li>
            )}
          </>
        )}
        {maxItems && breadcrumbItems.length > maxItems && (
          <>
            <li className={`mx-1 ${itemClassName}`}>...</li>
            <li className={`mx-1 ${separatorClassName}`}>{separator}</li>
          </>
        )}
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isClickable = item.pathname && !item.active && !isLast;
          return (
            <React.Fragment key={`${item.name}-${index}`}>
              <li>
                {isClickable ? (
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`hover:underline ${itemClassName}`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <span
                    className={`${itemClassName} ${
                      isLast || item.active ? activeItemClassName : ''
                    }`}
                  >
                    {item.name}
                  </span>
                )}
              </li>
              {!isLast && (
                <li className={`mx-1 ${separatorClassName}`}>{separator}</li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
});

/**
 * Build breadcrumb items from route names.
 */
export const BreadcrumbBuilder = observer((props: BreadcrumbBuilderProps) => {
  const {
    routeNames,
    separator = '/',
    className = '',
    itemClassName = '',
    activeItemClassName = '',
  } = props;

  const getPathByName = React.useCallback((name: string) => {
    return Plate.navigation.getPathByName(name);
  }, []);

  const items: BreadcrumbItem[] = React.useMemo(
    () =>
      routeNames.map((routeName, index) => {
        const pathname = getPathByName(routeName);
        const isLast = index === routeNames.length - 1;
        return {
          name: routeName,
          pathname,
          active: isLast,
        };
      }),
    [routeNames, getPathByName],
  );

  return (
    <Breadcrumb
      items={items}
      separator={separator}
      className={className}
      itemClassName={itemClassName}
      activeItemClassName={activeItemClassName}
    />
  );
});

BreadcrumbBuilder.displayName = 'BreadcrumbBuilder';
Breadcrumb.displayName = 'Breadcrumb';

