import { Plate } from "@shared/frontend";
import { RouterProvider, createRouter } from "@tanstack/react-router";
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

export const App = observer(() => {
  // Plate이 초기화되지 않았으면 로딩
  if (!Plate?.isInitialized) {
    return <div>앱 초기화 중...</div>;
  }

  return <RouterProvider router={router} />;
});
