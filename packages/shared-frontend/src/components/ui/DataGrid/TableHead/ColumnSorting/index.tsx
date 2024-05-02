import { Header } from '@tanstack/react-table';
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from 'react-icons/io';

interface ColumnSortingProps<T> {
  header: Header<T, any>;
  children?: React.ReactNode;
}

export const ColumnSorting = <T extends unknown>(
  props: ColumnSortingProps<T>,
) => {
  const { header, children } = props;
  return (
    <button
      onClick={header.column.getToggleSortingHandler()}
      className={`flex items-center transition-transform duration-200 ease-in-out ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
    >
      {children}
      <div className="relative overflow-hidden">
        {{
          asc: (
            <IoIosArrowRoundUp className="transform transition-transform duration-200 ease-in-out hover:scale-125 font-semibold text-large" />
          ),
          desc: (
            <IoIosArrowRoundDown className="transform transition-transform duration-200 ease-in-out hover:scale-125 font-semibold text-large" />
          ),
        }[header.column.getIsSorted() as string] ?? ' '}
      </div>
    </button>
  );
};
