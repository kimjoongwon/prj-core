import { Card, CardBody, ContainerProps } from '@coc/ui';

export const SearchFilterContainer = (props: ContainerProps) => {
  return (
    <Card className="h-40 rounded-2xl">
      <CardBody>{props.children}</CardBody>
    </Card>
  );
};
