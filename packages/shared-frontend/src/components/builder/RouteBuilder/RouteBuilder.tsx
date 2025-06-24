import { RouteBuilder as RouteBuilderInterface } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { LayoutBuilder } from '../LayoutBuilder';
import { PageBuilder } from '../PageBuilder';
import { PageProvider } from '../../../provider';

interface RouteBuilderProps {
  routeBuilder: RouteBuilderInterface;
}

export const RouteBuilder = observer((props: RouteBuilderProps) => {
  const { routeBuilder } = props;

  return (
    <PageProvider pageBuilder={routeBuilder?.page || {}}>
      <LayoutBuilder layoutBuilder={routeBuilder.layout}>
        <PageBuilder pageBuilder={routeBuilder?.page} />
      </LayoutBuilder>
    </PageProvider>
  );
});
