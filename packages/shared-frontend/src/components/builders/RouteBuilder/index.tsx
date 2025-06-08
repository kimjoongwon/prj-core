import { RouteBuilder as RouteBuilderInterface } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { LayoutBuilder } from '../LayoutBuilder';
import { PageBuilder } from '../PageBuilder';
import { RouteStateDebugger } from './RouteStateDebugger';

interface RouteBuilderProps {
  routeBuilder: RouteBuilderInterface;
}

export const RouteBuilder = observer((props: RouteBuilderProps) => {
  const { routeBuilder } = props;

  return (
    <>
      <LayoutBuilder layoutBuilder={routeBuilder.layout}>
        <PageBuilder pageBuilder={routeBuilder?.page} />
      </LayoutBuilder>
      {/* <RouteStateDebugger routeBuilder={routeBuilder} /> */}
    </>
  );
});
