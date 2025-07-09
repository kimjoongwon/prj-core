import { cva } from 'class-variance-authority';
import { ContainerProps } from '@shared/types';

const container = cva('flex flex-col');

export const Container = (props: ContainerProps) => {
  const { className = '', children } = props;
  return <div className={container({ className })}>{children}</div>;
};
