import { CellContext } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const DateCell = <T extends any>(cellContext: CellContext<T, Date>) => {
  const { getValue } = cellContext;
  return <p>{dayjs(getValue()).format('YYYY-MM-DD HH:mm:ss')}</p>
};
