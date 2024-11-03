import ReactDOM from 'react-dom/client';
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { AboutComponent } from './AboutComponent';
import { IndexComponent } from './IndexComponent';

const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}

const routes = [
  {
    path: '/index',
    component: IndexComponent,
  },
  {
    path: '/about',
    component: AboutComponent,
  },
];

const indexRoutes = routes.map(route =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: route.path,
    component: route.component,
  }),
);

const routeTree = rootRoute.addChildren(indexRoutes);

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(<RouterProvider router={router} />);
}
