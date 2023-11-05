type FormContainerProps = {
  children: React.ReactNode;
};

export const FormContainer = (props: FormContainerProps) => {
  const { children } = props;
  return <div className="max-w-screen-2xl">{children}</div>;
};
