import { HStack } from '@shared/frontend';

interface CategoriesPageProps {
  children: React.ReactNode;
  edit: React.ReactNode;
}

const CategoriesLayout = (props: CategoriesPageProps) => {
  const { children } = props;
  return <HStack>{children}</HStack>;
};

export default CategoriesLayout;
