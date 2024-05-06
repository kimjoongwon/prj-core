import { VStack } from '../../ui';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const AdminMainLayout = (props: MainLayoutProps) => {
  const { children } = props;
  return <VStack className="m-4 w-full border-1 rounded-lg">{children}</VStack>;
};
