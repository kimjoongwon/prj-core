import { HTMLAttributes } from 'react';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const Container = (props: ContainerProps) => {
  return <div {...props} />;
};
