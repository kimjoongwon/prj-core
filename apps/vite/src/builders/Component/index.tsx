import { observer } from 'mobx-react-lite';
import { ComponentBuilder as ComponentBuilderState } from '@shared/types';
import { ComponentManager } from '@shared/frontend';
import { isEmpty } from 'lodash-es';
import { useFormState } from '../FormBuilder';
import { toJS } from 'mobx';

interface ComponentBuilderProps {
  componentBuilder: ComponentBuilderState;
}

export const Component = observer((props: ComponentBuilderProps) => {
  const formState = useFormState();
  const { componentBuilder } = props;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const Component = ComponentManager[componentBuilder.type];
  console.log(toJS(formState));
  const callbacks = componentBuilder.validation?.timings?.map(timing => {
    return {
      [timing]: (value: unknown) => {
        if (!componentBuilder.validation) {
          return null;
        }
        if (componentBuilder.validation?.required) {
          if (isEmpty(value)) {
            componentBuilder.validation.errorMessage = componentBuilder
              .validation?.messages?.required as string;
            componentBuilder.validation.isInvalid = true;
            return;
          }
        }
        componentBuilder.validation.errorMessage = '';
        componentBuilder.validation.isInvalid = false;
      },
    };
  });

  const _props = callbacks?.reduce((acc, callback) => {
    return { ...acc, ...callback };
  });

  return (
    <Component
      {...componentBuilder.props}
      state={formState}
      path={componentBuilder.path}
      componentBuilder={componentBuilder}
      errorMessage={componentBuilder.validation?.errorMessage || ' '}
      isInvalid={componentBuilder.validation?.isInvalid}
      {..._props}
    />
  );
});
