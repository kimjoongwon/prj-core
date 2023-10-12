import { SearchFilterContainerProps } from '.';
import { Card, CardBody } from '../..';

export const SearchFilterContainerView = (
  props: SearchFilterContainerProps,
) => {
  return (
    <Card>
      <CardBody>{props.children}</CardBody>
    </Card>
  );
};
