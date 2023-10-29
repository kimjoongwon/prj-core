interface TableContainerProps {
  children: React.ReactNode;
}

export const TableLayout = (props: TableContainerProps) => {
  const { children } = props;

  return (
    <div className="flex flex-auto w-full flex-col max-w-[1536px] min-w-fit space-y-4">
      {children}
    </div>
  );
};
