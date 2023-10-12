import { Card, CardBody } from '../..';
import { ContainerProps } from '../../../types';

export const SearchFilterContainer = (props: ContainerProps) => {
  return (
    <Card>
      <div className="flex flex-1 w-full h-full">
        <div>{props.children}</div>
      </div>
    </Card>
  );
};
