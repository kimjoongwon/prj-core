import { RouteBuilder as RouteBuilderInterface } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router';
import { LayoutBuilder } from '../LayoutBuilder/LayoutBuilder';
import { PageBuilder } from '../Page/PageBuilder';

interface RouteBuilderProps {
  routeBuilder: RouteBuilderInterface;
}

export const RouteBuilder = observer((props: RouteBuilderProps) => {
  const { routeBuilder } = props;
  console.log('RouteBuilder props:', props.routeBuilder.pathname);
  return (
    <LayoutBuilder layoutBuilder={routeBuilder.layout}>
      <PageBuilder pageBuilder={routeBuilder?.page} />
    </LayoutBuilder>
  );
});
