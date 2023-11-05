interface EditLayoutProps {
  children: React.ReactNode;
}

export const EditLayout = (props: EditLayoutProps) => {
  const { children } = props;

  return (
    <div className="flex space-y-4 w-full justify-center">
      {children}
    </div>
  );
};
