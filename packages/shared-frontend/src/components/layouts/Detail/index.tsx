interface DetailLayoutProps {
  children: React.ReactNode;
}

export const DetailLayout = (props: DetailLayoutProps) => {
  const { children } = props;

  return <div className="flex flex-1 flex-col p-4">{children}</div>;
};
