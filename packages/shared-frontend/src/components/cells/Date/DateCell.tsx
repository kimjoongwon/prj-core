import { CellContext } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const DateCell = <T extends unknown>(
  cellContext: CellContext<T, string>,
) => {
  const { getValue } = cellContext;
  return <p>{dayjs(getValue()).format('YYYY-MM-DD HH:mm:ss')}</p>;
};
