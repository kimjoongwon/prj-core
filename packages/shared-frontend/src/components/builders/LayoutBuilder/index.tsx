import { ReactNode } from 'react';
import { LayoutBuilder as LayoutBuilderInterface } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router';
import { AuthLayout } from '../../layouts/Auth';
import { ModalLayout } from '../../layouts/Modal';
import { DashboardLayout } from '../../layouts/Dashboard';
import { Header } from '../../Header';

interface Layout {
  children: ReactNode;
  layoutBuilder?: LayoutBuilderInterface;
}

type LayoutBuilderProps = Layout;

export const LayoutBuilder = observer((props: LayoutBuilderProps) => {
  const { children, layoutBuilder } = props;

  if (layoutBuilder?.type === 'Auth') {
    return (
      <AuthLayout
        formComponent={<Outlet />}
        adImageSrc="/ad.png"
        adImageAlt="Advertisement"
      />
    );
  }

  if (layoutBuilder?.type === 'Modal') {
    return (
      <ModalLayout>
        {children}
        <Outlet />
      </ModalLayout>
    );
  }

  if (layoutBuilder?.type === 'Dashboard') {
    return (
      <DashboardLayout headerComponent={<Header />}>
        {children}
        <Outlet />
      </DashboardLayout>
    );
  }

  return (
    <>
      <Outlet />
      {children}
    </>
  );
});
