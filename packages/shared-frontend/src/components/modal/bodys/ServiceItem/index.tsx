import { observer } from 'mobx-react-lite';
import { UsersTable } from '../../../tables/Users';
import { SpaceDto, UserDto } from '../../../../model';
import { SpacesTable } from '../../../tables';

interface Props {
  items: SpaceDto[] | UserDto[];
  state: {
    selectedKeys?: string[];
    query?: any;
  };
  type: 'user' | 'space';
}

export const ServiceItemModalBody = observer((props: Props) => {
  const { items, state, type } = props;

  const bodys: Record<string, React.ReactNode> = {
    user: (
      <UsersTable
        selectionMode="multiple"
        users={items as UserDto[]}
        state={state}
      />
    ),
    space: (
      <SpacesTable
        selectionMode="multiple"
        spaces={items as SpaceDto[]}
        state={state}
      />
    ),
  };

  return <>{bodys[type]}</>;
});
