'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router';
import {
  Breadcrumbs,
  BreadcrumbItem as HeroBreadcrumbItem,
} from '@heroui/react';
import { ChevronRight, Home } from 'lucide-react';
import type {
  BreadcrumbItem,
  BreadcrumbProps,
  BreadcrumbBuilderProps,
  Route,
} from '@shared/types';
import { Plate } from '../../../providers';

/**
 * HeroUI-based Breadcrumb component with responsive design
 * If no items prop is provided, breadcrumbs are automatically
 * generated from the current location using the global navigation service.
 */
export const Breadcrumb = observer((props: BreadcrumbProps) => {
  const {
    items,
    separator,
    className = '',
    itemClassName = '',
    activeItemClassName = '',
    maxItems,
    showHomeIcon = false,
    homeRouteName = '홈',
    onItemClick,
  } = props;

  const location = useLocation();

  const breadcrumbItems = React.useMemo<BreadcrumbItem[]>(() => {
    if (items) return items;
    // Fallback to active routes if getBreadcrumbPath is not available
    const activeRoutes = Plate.navigation.getActiveRoutes();
    return activeRoutes.map(route => ({
      name: route.name,
      pathname: route.fullPath,
      active: route.active,
    }));
  }, [items, location.pathname]);

  const navigateByName = React.useCallback(
    (name: string, params?: object, search?: Record<string, string>) => {
      Plate.navigation.getNavigator().pushByName(name, params, search);
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
    if (
      'pathname' in item &&
      item.pathname &&
      !('active' in item && item.active)
    ) {
      Plate.navigation.getNavigator().push(item.pathname);
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

  // Create custom separator if provided
  const customSeparator = separator ? (
    typeof separator === 'string' ? (
      <span className="text-default-400">{separator}</span>
    ) : (
      separator
    )
  ) : (
    <ChevronRight className="h-4 w-4 text-default-400" />
  );

  return (
    <div className={`w-full ${className}`}>
      <Breadcrumbs
        separator={customSeparator}
        className="flex-wrap"
        classNames={{
          list: 'flex-wrap',
          separator: 'px-1',
        }}
        maxItems={maxItems}
        renderEllipsis={({ items }) => (
          <div className="flex items-center">
            <span className="text-medium text-default-400 px-2">...</span>
          </div>
        )}
      >
        {/* Home icon item */}
        {showHomeIcon && (
          <HeroBreadcrumbItem
            key="home"
            onPress={handleHomeClick}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">홈</span>
            </div>
          </HeroBreadcrumbItem>
        )}

        {/* Breadcrumb items */}
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isActive = item.active || isLast;
          const isClickable = item.pathname && !isActive;

          return (
            <HeroBreadcrumbItem
              key={`${item.name}-${index}`}
              isCurrent={isActive}
              onPress={isClickable ? () => handleItemClick(item) : undefined}
              classNames={{
                item: `
                  ${
                    isClickable
                      ? 'cursor-pointer hover:text-primary transition-colors'
                      : 'cursor-default'
                  }
                  ${
                    isActive
                      ? `text-foreground font-medium ${activeItemClassName}`
                      : 'text-default-600'
                  }
                  ${itemClassName}
                  max-w-[150px] sm:max-w-[200px] md:max-w-none
                `,
              }}
            >
              <span className="truncate" title={item.name}>
                {item.name}
              </span>
            </HeroBreadcrumbItem>
          );
        })}
      </Breadcrumbs>
    </div>
  );
});

/**
 * Build breadcrumb items from route names using HeroUI.
 */
export const BreadcrumbBuilder = observer((props: BreadcrumbBuilderProps) => {
  const {
    routeNames,
    separator,
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
