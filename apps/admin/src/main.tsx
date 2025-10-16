import { StoreProvider } from "@cocrepo/store";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { Providers } from "./providers/Providers";

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <StoreProvider>
      <Providers>
        <App />
      </Providers>
    </StoreProvider>
  );
}
