import { RouteBuilder as RouteBuilderState } from '@shared/types';
import { LayoutBuilder } from '../LayoutBuilder';
import { PageBuilder } from '../PageBuilder';
import { toJS } from 'mobx';

interface RouteBuilderProps {
  state: RouteBuilderState;
}

export const RouteBuilder = (props: RouteBuilderProps) => {
  const { state } = props;
  console.log('layout', toJS(state));
  return (
    <LayoutBuilder state={state.layout}>
      <PageBuilder state={state.layout?.page} />
    </LayoutBuilder>
  );
};
