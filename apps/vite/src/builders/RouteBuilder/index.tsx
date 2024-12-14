import { RouteBuilder as RouteBuilderState } from '@shared/types';
import { LayoutBuilder } from '../LayoutBuilder';
import { PageBuilder } from '../PageBuilder';

interface RouteBuilderProps {
  state: RouteBuilderState;
}

export const RouteBuilder = (props: RouteBuilderProps) => {
  const { state } = props;
  // console.log('state', state);
  if (!state) {
    return null;
  }
  return (
    <LayoutBuilder state={state.layout}>
      <PageBuilder state={state.layout?.page} />
    </LayoutBuilder>
  );
};
