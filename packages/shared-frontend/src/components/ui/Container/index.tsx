import { tv } from 'tailwind-variants';
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const container = tv({
  base: 'flex flex-col',
});

export const Container = (props: ContainerProps) => {
  const { className = '', children } = props;
  return (
    <div
      className={container({
        class: className,
      })}
    >
      {children}
    </div>
  );
};
