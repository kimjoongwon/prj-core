import { Plate, initializePlateWithRouter } from "@shared/frontend";
import { FileRoutesByPath, RouterProvider, createRouter } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export type Router = typeof router;

export const App = observer(() => {
  // Plate이 초기화되지 않았으면 로딩
  if (!Plate?.isInitialized) {
    return <div>앱 초기화 중...</div>;
  }

  return <RouterProvider router={router} />;
});

// Utility function to get typed navigation store with router inference
export function getTypedNavigation() {
  if (!Plate?.navigation) {
    throw new Error("Plate navigation not initialized");
  }

  const _test = () => {
    const _test = "test";
  };

  // This allows the navigation store to be properly typed with the router type
  return Plate.navigation as import("@shared/frontend").NavigationStore<typeof router>;
}
