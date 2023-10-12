import { Card, CardBody } from '../..';
import { ContainerProps } from '../../../types';

export const SearchFilterContainer = (props: ContainerProps) => {
  return (
    <Card className="h-40">
      <CardBody>{props.children}</CardBody>
    </Card>
  );
};
