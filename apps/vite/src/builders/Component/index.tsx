import { observer } from 'mobx-react-lite';
import { ComponentBuilder as ComponentBuilderState } from '@shared/types';
import { ComponentManager } from '@shared/frontend';
import { isEmpty } from 'lodash-es';
import { useFormState } from '../FormBuilder';
import { TableBuilder } from '../TableBuilder/TableBuilder';

interface ComponentBuilderProps {
  componentBuilder: ComponentBuilderState;
  data?: (unknown & { id: string })[];
}

export const Component = observer((props: ComponentBuilderProps) => {
  const formState = useFormState();

  const { componentBuilder } = props;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const Component = ComponentManager[componentBuilder.type];
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

  if (componentBuilder.type === 'TableBuilder') {
    return <TableBuilder tableBuilder={componentBuilder.props.tableBuilder} />;
  }

  return (
    <Component
      {...componentBuilder.props}
      state={formState?.payload}
      path={componentBuilder.path}
      componentBuilder={componentBuilder}
      errorMessage={componentBuilder.validation?.errorMessage || ' '}
      isInvalid={componentBuilder.validation?.isInvalid}
      {..._props}
    />
  );
});
