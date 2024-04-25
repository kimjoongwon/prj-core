import { HStack } from '@shared/frontend';

interface CategoriesPageProps {
  children: React.ReactNode;
  edit: React.ReactNode;
}

const CategoriesLayout = (props: CategoriesPageProps) => {
  const { children, edit } = props;
  return (
    <HStack>
      {children}
      {edit}
    </HStack>
  );
};

export default CategoriesLayout;
