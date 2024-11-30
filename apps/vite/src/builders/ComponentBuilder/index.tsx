import { observer } from 'mobx-react-lite';
import { ComponentBuilder as ComponentBuilderState } from '@shared/types';
import { ComponentManager } from '@shared/frontend';

interface ComponentBuilderProps {
  state: ComponentBuilderState;
}

export const ComponentBuilder = observer((props: ComponentBuilderProps) => {
  const { state } = props;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const Component = ComponentManager[state.type];
  return <Component {...state.props} state={state.props} path="value" />;
});
