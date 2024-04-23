import { HStack } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
interface CategoryContainerProps {
  children: React.ReactNode;
}

export const CategoryContainer = observer((props: CategoryContainerProps) => {
  const { children } = props;
  return <HStack className="gap-2">{children}</HStack>;
});
