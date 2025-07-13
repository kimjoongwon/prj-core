import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AppProvider, AuthProvider, QueryProvider } from "@shared/frontend";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = (props: ProvidersProps) => {
  const { children } = props;

  return (
    <QueryProvider>
      <HeroUIProvider>
        <NuqsAdapter>
          <AuthProvider>
            <AppProvider>{children}</AppProvider>
          </AuthProvider>
          <ToastProvider placement="bottom-center" />
        </NuqsAdapter>
      </HeroUIProvider>
    </QueryProvider>
  );
};
