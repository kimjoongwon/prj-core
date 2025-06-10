'use client';

import { observer } from 'mobx-react-lite';
import { HStack } from '../HStack';
import { VStack } from '../VStack';
import { Button } from '@heroui/react';
import { Route } from '@shared/types';
import { Plate } from '../../providers/App/AppProvider';
import { renderLucideIcon } from '../../utils/iconUtils';

interface NavbarProps {
  routes: Route[];
  direction?: 'horizontal' | 'vertical';
}

export const Navbar = observer((props: NavbarProps) => {
  const { routes, direction = 'horizontal' } = props;

  const handleRouteClick = (route: Route) => {
    if (route.pathname) {
      Plate.navigation.push(route.pathname);
    }
  };

  // Route의 active 속성을 직접 사용
  const isRouteActive = (route: Route): boolean => {
    return route.active || false;
  };

  if (direction === 'vertical') {
    return (
      <VStack className="gap-2">
        {routes?.map((route, index) => (
          <Button
            variant="light"
            color={route.active ? 'primary' : 'default'}
            key={route.name || `route-${index}`}
            onPress={() => handleRouteClick(route)}
            startContent={
              route.icon
                ? renderLucideIcon(route.icon, 'w-4 h-4', 16)
                : undefined
            }
          >
            {route.name || route.pathname}
          </Button>
        ))}
      </VStack>
    );
  }

  return (
    <HStack className="flex-1 gap-2 items-center justify-center">
      {routes?.map((route, index) => (
        <Button
          variant="light"
          color={route.active ? 'primary' : 'default'}
          key={route.name || `route-${index}`}
          onPress={() => handleRouteClick(route)}
          startContent={
            route.icon ? renderLucideIcon(route.icon, 'w-4 h-4', 16) : undefined
          }
        >
          {route.name || route.pathname}
        </Button>
      ))}
    </HStack>
  );
});
