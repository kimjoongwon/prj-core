import { ToastProvider } from "@heroui/react";

interface UIProvidersProps {
  children: React.ReactNode;
}

export const UIProviders = (props: UIProvidersProps) => {
  const { children } = props;

  return (
    <>
      <ToastProvider placement="bottom-center" />
      {children}
    </>
  );
};
