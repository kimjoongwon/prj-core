import React from 'react';
import { useUnifiedNavigation } from '../../hooks/useUnifiedNavigation';

interface RouteNavigationButtonProps {
  routeName: string;
  pathParams?: object;
  searchParams?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

/**
 * 라우트 이름을 사용해서 네비게이션하는 버튼 컴포넌트
 */
export function RouteNavigationButton({
  routeName,
  pathParams,
  searchParams,
  children,
  className = '',
  disabled = false,
  onClick,
}: RouteNavigationButtonProps) {
  const { navigateByName, getPathByName } = useUnifiedNavigation();

  const handleClick = () => {
    onClick?.();
    if (!disabled) {
      navigateByName(routeName, pathParams, searchParams);
    }
  };

  // 라우트가 존재하는지 확인
  const routePath = getPathByName(routeName);
  const isValidRoute = !!routePath;

  if (!isValidRoute) {
    console.warn(
      `RouteNavigationButton: 라우트 이름 "${routeName}"을 찾을 수 없습니다.`,
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || !isValidRoute}
      className={`${className} ${
        !isValidRoute ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={
        !isValidRoute ? `라우트 "${routeName}"을 찾을 수 없습니다.` : undefined
      }
    >
      {children}
    </button>
  );
}

interface ConditionalNavigationButtonProps {
  condition: boolean;
  routeNameIfTrue: string;
  routeNameIfFalse: string;
  pathParams?: object;
  searchParams?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

/**
 * 조건에 따라 다른 라우트로 네비게이션하는 버튼 컴포넌트
 */
export function ConditionalNavigationButton({
  condition,
  routeNameIfTrue,
  routeNameIfFalse,
  pathParams,
  searchParams,
  children,
  className = '',
  disabled = false,
  onClick,
}: ConditionalNavigationButtonProps) {
  const { navigateConditional, getConditionalPath } = useUnifiedNavigation();

  const handleClick = () => {
    onClick?.();
    if (!disabled) {
      navigateConditional(
        condition,
        routeNameIfTrue,
        routeNameIfFalse,
        pathParams,
        searchParams,
      );
    }
  };

  // 타겟 라우트 경로 확인
  const targetPath = getConditionalPath(
    condition,
    routeNameIfTrue,
    routeNameIfFalse,
  );
  const isValidRoute = !!targetPath;
  const targetRouteName = condition ? routeNameIfTrue : routeNameIfFalse;

  if (!isValidRoute) {
    console.warn(
      `ConditionalNavigationButton: 라우트 이름 "${targetRouteName}"을 찾을 수 없습니다.`,
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || !isValidRoute}
      className={`${className} ${
        !isValidRoute ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={
        !isValidRoute
          ? `라우트 "${targetRouteName}"을 찾을 수 없습니다.`
          : undefined
      }
    >
      {children}
    </button>
  );
}

interface RouteNavigationLinkProps {
  routeName: string;
  pathParams?: object;
  searchParams?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

/**
 * 라우트 이름을 사용해서 네비게이션하는 링크 컴포넌트
 */
export function RouteNavigationLink({
  routeName,
  pathParams,
  searchParams,
  children,
  className = '',
  activeClassName = '',
}: RouteNavigationLinkProps) {
  const { navigateByName, getPathByName, currentPath } = useUnifiedNavigation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateByName(routeName, pathParams, searchParams);
  };

  // 라우트가 존재하는지 확인
  const routePath = getPathByName(routeName);
  const isValidRoute = !!routePath;
  const isActive = currentPath === routePath;

  if (!isValidRoute) {
    console.warn(
      `RouteNavigationLink: 라우트 이름 "${routeName}"을 찾을 수 없습니다.`,
    );
  }

  return (
    <a
      href={routePath || '#'}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ''} ${
        !isValidRoute ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={
        !isValidRoute ? `라우트 "${routeName}"을 찾을 수 없습니다.` : undefined
      }
    >
      {children}
    </a>
  );
}
