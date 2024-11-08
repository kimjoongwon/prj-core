import ReactDOM from 'react-dom/client';
import {
  Link,
  RouterProvider,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router';
import { RootComponent } from './RootComponent';
import './index.css';
import { ReactQueryProvider } from '@shared/frontend';

const rootRoute = createRootRoute({
  component: () => <RootComponent key={'useGetSpace'} />,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>

        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

const routeTree = rootRoute;

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

  root.render(
    <ReactQueryProvider>
      <RouterProvider router={router} />
    </ReactQueryProvider>,
  );
}
