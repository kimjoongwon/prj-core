import { observer } from 'mobx-react-lite';
import { HStack, VStack, Plate } from '../../../..';
import { Button } from '@heroui/react';
import { Route } from '@shared/types';
import { renderLucideIcon } from '../../../utils/iconUtils';

interface NavbarProps {
  routes: Route[];
  direction?: 'horizontal' | 'vertical';
}

export const Navbar = observer((props: NavbarProps) => {
  const { routes, direction = 'horizontal' } = props;

  const handleRouteClick = (route: Route) => {
    if (route.fullPath) {
      Plate.navigation.getNavigator().push(route.fullPath);
    }
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
            {route.name || route.fullPath}
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
          {route.name || route.fullPath}
        </Button>
      ))}
    </HStack>
  );
});
