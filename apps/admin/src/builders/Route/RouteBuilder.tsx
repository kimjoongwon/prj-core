import { RouteBuilder as RouteBuilderInterface } from '@shared/types';
import { LayoutBuilder } from '../LayoutBuilder/LayoutBuilder';
import { PageBuilder } from '../Page/PageBuilder';

interface RouteBuilderProps {
  routeBuilder: RouteBuilderInterface;
}

export const RouteBuilder = (props: RouteBuilderProps) => {
  const { routeBuilder } = props;

  if (!routeBuilder) {
    return null;
  }

  return (
    <LayoutBuilder layoutBuilder={routeBuilder.layout}>
      {routeBuilder.layout?.page && (
        <PageBuilder pageBuilder={routeBuilder.layout?.page} />
      )}
    </LayoutBuilder>
  );
};
