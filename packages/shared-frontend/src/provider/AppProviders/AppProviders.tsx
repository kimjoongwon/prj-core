import { ToastProvider } from "@heroui/react";
import { AuthProvider, QueryProvider } from "../index";
import { NuqsAdapter } from "nuqs/adapters/react";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = (props: AppProvidersProps) => {
  const { children } = props;

  return (
    <QueryProvider>
      <NuqsAdapter>
        <AuthProvider>{children}</AuthProvider>
        <ToastProvider placement="bottom-center" />
      </NuqsAdapter>
    </QueryProvider>
  );
};
