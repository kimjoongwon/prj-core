import { ReactNode } from 'react';
import { LayoutBuilder as LayoutBuilderInterface } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router';
import { AuthLayout } from '../../layout/AuthLayout';
import { ModalLayout } from '../../layout/ModalLayout';
import { DashboardLayoutBuilder } from './DashboardLayoutBuilder';
import { TabNavigation } from '../TabNavigation/TabNavigation';

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
    return <ModalLayout title={layoutBuilder.name}>{children}</ModalLayout>;
  }

  if (layoutBuilder?.type === 'Dashboard') {
    return (
      <DashboardLayoutBuilder layoutBuilder={layoutBuilder}>
        {children}
      </DashboardLayoutBuilder>
    );
  }

  if (layoutBuilder?.type === 'Tab') {
    return (
      <div>
        {layoutBuilder.tabs && <TabNavigation tabBuilder={layoutBuilder.tabs} />}
        <Outlet />
      </div>
    );
  }

  return (
    <>
      <Outlet />
      {children}
    </>
  );
});
