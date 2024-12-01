import { observer } from 'mobx-react-lite';
import { ComponentBuilder as ComponentBuilderState } from '@shared/types';
import { ComponentManager } from '@shared/frontend';
import { isEmpty } from 'lodash-es';

interface ComponentBuilderProps {
  state: ComponentBuilderState;
}

export const ComponentBuilder = observer((props: ComponentBuilderProps) => {
  const { state } = props;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const Component = ComponentManager[state.type];

  const callbacks = state.validation?.timings?.map(timing => {
    return {
      [timing]: (value: unknown) => {
        if (!state.validation) {
          return null;
        }
        console.log('value', value);
        if (state.validation?.required) {
          if (isEmpty(value)) {
            state.validation.errorMessage = state.validation?.messages
              ?.required as string;
            state.validation.isInvalid = true;
            return;
          }
        }
        state.validation.errorMessage = '';
        state.validation.isInvalid = false;
      },
    };
  });

  const _props = callbacks?.reduce((acc, callback) => {
    return { ...acc, ...callback };
  });

  console.log('state', state.validation?.errorMessage);

  return (
    <Component
      {...state.props}
      state={state}
      path="props.value"
      errorMessage={state.validation?.errorMessage || ' '}
      isInvalid={state.validation?.isInvalid}
      {..._props}
    />
  );
});
