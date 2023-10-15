import { Card, CardBody, ContainerProps } from '@coc/ui';
interface SearchFilterContainerProps {
  children?: React.ReactNode;
}
export const SearchFilterContainer = (props: SearchFilterContainerProps) => {
  return (
    <Card className="min-h-unit-24 rounded-2xl">
      <CardBody>{props.children}</CardBody>
    </Card>
  );
};
