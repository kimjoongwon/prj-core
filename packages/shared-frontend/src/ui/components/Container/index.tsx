interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = (props: ContainerProps) => {
  return (
    <div
      className={`flex flex-col w-full px-2 items-center ${props.className}`}
    >
      {props.children}
    </div>
  );
};
