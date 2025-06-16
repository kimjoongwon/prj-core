import { tv } from 'tailwind-variants';
import { ContainerProps } from '@shared/types';

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
