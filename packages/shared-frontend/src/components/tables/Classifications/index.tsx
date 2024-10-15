import { observer } from 'mobx-react-lite';
import { CustomDataGridProps, DataGrid } from '../../ui';
import { ClassificationDto } from '../../../model';
import { useClassificationsTables } from './hooks/useClassificationsTable';

export interface ClassificationsTableProps extends CustomDataGridProps {
  classifications: ClassificationDto[];
}

export const ClassificationsTable = observer(
  (props: ClassificationsTableProps) => {
    const { classifications, ...rest } = props;
    const { columns, rightButtons, leftButtons } =
      useClassificationsTables(props);

    return (
      <DataGrid
        {...rest}
        hideButtons
        rightButtons={rightButtons}
        leftButtons={leftButtons}
        data={classifications}
        columns={columns}
      />
    );
  },
);
