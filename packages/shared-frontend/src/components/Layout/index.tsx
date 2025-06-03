type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export const Layout = (props: LayoutProps) => {
  return (
    <div className={`flex flex-col w-full items-center ${props.className}`}>
      {props.children}
    </div>
  );
};
