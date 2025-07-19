import { ToastProvider } from "@heroui/react";
import { AppProvider, AuthProvider, QueryProvider } from "../index";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = (props: AppProvidersProps) => {
  const { children } = props;

  return (
    <QueryProvider>
      <NuqsAdapter>
        <AuthProvider>
          <AppProvider>{children}</AppProvider>
        </AuthProvider>
        <ToastProvider placement="bottom-center" />
      </NuqsAdapter>
    </QueryProvider>
  );
};
