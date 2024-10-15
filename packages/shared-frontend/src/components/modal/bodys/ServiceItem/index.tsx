import { observer } from 'mobx-react-lite';
import { UsersTable } from '../../../tables/Users';
import { SpaceDto, UserDto } from '../../../../model';
import { SpacesTable } from '../../../tables';
import { CustomDataGridProps } from '../../../ui';

interface Props extends CustomDataGridProps {
  items: SpaceDto[] | UserDto[];
  type: 'user' | 'space';
}

export const ServiceItemModalBody = observer((props: Props) => {
  const { items, state, type, totalCount, ...rest } = props;

  const bodys: Record<string, React.ReactNode> = {
    user: (
      <UsersTable
        {...rest}
        selectionMode="multiple"
        users={items as UserDto[]}
        state={state}
        totalCount={totalCount}
      />
    ),
    space: (
      <SpacesTable
        {...rest}
        selectionMode="multiple"
        spaces={items as SpaceDto[]}
        state={state}
        totalCount={totalCount}
      />
    ),
  };

  return <>{bodys[type]}</>;
});
