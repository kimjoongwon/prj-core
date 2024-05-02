import { Header } from '@tanstack/react-table';

interface ColumnResizerProps<T> {
  header: Header<T, any>;
}

export const ColumnResizer = <T extends unknown>(
  props: ColumnResizerProps<T>,
) => {
  const { header } = props;

  return (
    <div
      className="absolute right-0 top-0 h-3/4 w-3 hover:border-r-2 border-blue-500 select-none touch-none cursor-col-resize"
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
    />
  );
};
