'use client';

import { ContainerProps } from '@coc/web';
import { ServiceEditPageProvider } from './provider';

interface LayoutProps extends ContainerProps {
  params: { serviceId: string | 'new' };
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return <ServiceEditPageProvider>{children}</ServiceEditPageProvider>;
}
