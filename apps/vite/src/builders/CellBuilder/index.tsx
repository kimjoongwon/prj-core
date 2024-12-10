import { UserDto } from '@shared/frontend';
import { CellContext } from '@tanstack/react-table';

export const CellBuilder = (props: CellContext<UserDto, string>) => {
  return <div>{props.getValue()}</div>;
};
