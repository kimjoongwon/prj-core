import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Button } from '@shared/frontend';

export function RootComponent() {
  return (
    <div>
      <Button>RootComponent</Button>;
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
