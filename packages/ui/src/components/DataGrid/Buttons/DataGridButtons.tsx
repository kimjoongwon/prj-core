import { Table } from '@tanstack/react-table';
import { Button } from '../../Button';
import { DataGridButton } from '../DataGrid';
import { Link } from '@nextui-org/react';
import { v4 } from 'uuid';

interface DataGridButtonsProps<T> {
  buttons?: DataGridButton<T>[];
  table: Table<T>;
}

export const DataGridButtons = <T extends any>(
  props: DataGridButtonsProps<T>,
) => {
  const { buttons = [], table } = props;
  return (
    <div className="flex flex-row">
      {buttons.map(button => (
        <Link key={v4()} href={button.href} color="foreground" size="lg">
          <Button
            {...button.props}
            key={v4()}
            onClick={() => button.onClick(table)}
          >
            {button.text}
          </Button>
        </Link>
      ))}
    </div>
  );
};
