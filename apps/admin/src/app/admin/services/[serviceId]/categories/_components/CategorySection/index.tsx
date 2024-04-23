import { VStack } from '@shared/frontend';
import { observer } from 'mobx-react-lite';

interface CategorySectionProps {
  children: React.ReactNode;
}

export const CategorySection = observer((props: CategorySectionProps) => {
  const { children } = props;
  return <VStack className="gap-2">{children}</VStack>;
});
