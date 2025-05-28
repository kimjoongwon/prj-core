import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router';
import { type RouteBuilder as IRouteBuilder } from '@shared/types';
import { RouteBuilder, ILLIT } from '@shared/frontend';
import { v4 } from 'uuid';
import { Spinner } from '@heroui/react';
import { observer } from 'mobx-react-lite';

// Helper function to generate route objects for the router
const generateRouteObject = (routeBuilder: IRouteBuilder): RouteObject => ({
  path: routeBuilder?.pathname,
  element: <RouteBuilder key={v4()} routeBuilder={routeBuilder} />,
  errorElement: <div>error</div>,
  children: routeBuilder?.children?.map(generateRouteObject),
});

// Using the global ILLIT instance directly instead of the useApp hook
// Wrapping with observer to react to changes in the ILLIT mobx store
export const App = observer(() => {
  // Need to use React.useState and useEffect to react to changes in ILLIT
  const [isIllitInitialized, setIsIllitInitialized] = React.useState(false);

  React.useEffect(() => {
    // Check if ILLIT is initialized on mount and set up a periodic check
    const checkIllit = () => {
      if (ILLIT?.isInitialized) {
        setIsIllitInitialized(true);
      }
    };

    // Check immediately
    checkIllit();

    // Set up a periodic check until ILLIT is initialized
    const intervalId = setInterval(() => {
      checkIllit();
      if (isIllitInitialized) {
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [isIllitInitialized]);

  if (!isIllitInitialized || !ILLIT?.isInitialized) {
    return <Spinner />;
  }

  const router = createBrowserRouter(
    ILLIT.navigation.routeBuilders?.map(generateRouteObject),
  );

  return <RouterProvider router={router} />;
});
