import { ReactNode } from 'react';
import { LayoutBuilder as LayoutBuilderInterface } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router';
import { AuthLayout } from '../../layouts/Auth';
import { ModalLayout } from '../../layouts/Modal';
import { DashboardLayout } from '../../layouts/Dashboard';
import { Header } from '../../Header';
import { Navbar } from '../../Navbar';

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
    const mockNavbarItems = [
      {
        url: '/dashboard',
        name: 'Dashboard',
        onClick: () => console.log('Dashboard clicked'),
      },
      {
        url: '/users',
        name: 'Users',
        onClick: () => console.log('Users clicked'),
      },
      {
        url: '/settings',
        name: 'Settings',
        onClick: () => console.log('Settings clicked'),
      },
      {
        url: '/analytics',
        name: 'Analytics',
        onClick: () => console.log('Analytics clicked'),
      },
      {
        url: '/reports',
        name: 'Reports',
        onClick: () => console.log('Reports clicked'),
      },
    ];

    return (
      <DashboardLayout
        headerComponent={
          <Header
            centerComponent={<Navbar navbarItems={mockNavbarItems} />}
            drawerComponent={
              <Navbar navbarItems={mockNavbarItems} direction="vertical" />
            }
          />
        }
      >
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
