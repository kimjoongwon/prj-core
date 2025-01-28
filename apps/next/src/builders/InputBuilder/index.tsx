import { observer } from 'mobx-react-lite';
import { InputBuilder as InputBuilderInterface } from '@shared/types';
import { ComponentManager } from '@shared/frontend';
import { isEmpty } from 'lodash-es';
import { usePageState } from '../Page/PageBuilder';
import { TabNavigation } from '../TabNavigation/TabNavigation';
import { DataGridBuilder } from '../DataGridBuilder/DataGridBuilder';

interface InputBuilderProps {
  inputBuilder: InputBuilderInterface;
  data?: (unknown & { id: string })[];
}

export const InputBuilder = observer((props: InputBuilderProps) => {
  const state = usePageState();
  const { inputBuilder } = props;
  console.log({ ...state });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const Component = ComponentManager[inputBuilder.type];
  const callbacks = inputBuilder.validation?.timings?.map(timing => {
    return {
      [timing]: (value: unknown) => {
        if (!inputBuilder.validation) {
          return null;
        }
        if (inputBuilder.validation?.required) {
          if (isEmpty(value)) {
            inputBuilder.validation.errorMessage = inputBuilder.validation
              ?.messages?.required as string;
            inputBuilder.validation.isInvalid = true;
            return;
          }
        }
        inputBuilder.validation.errorMessage = '';
        inputBuilder.validation.isInvalid = false;
      },
    };
  });

  const _props = callbacks?.reduce((acc, callback) => {
    return { ...acc, ...callback };
  });

  if (inputBuilder.type === 'DataGridBuilder') {
    return (
      <DataGridBuilder dataGridBuilder={inputBuilder.props.dataGridBuilder} />
    );
  }

  if (inputBuilder.type === 'TabNavigation') {
    return <TabNavigation tabBuilder={inputBuilder.props.tabBuilder} />;
  }

  if (inputBuilder.visibleCondition) {
    const { eq } = inputBuilder.visibleCondition;
    const value = state?.form?.data[eq.path];
    if (value !== eq.value) {
      return null;
    }
  }
  console.log('inputBuilder', inputBuilder);
  console.log('state', state);
  return (
    <Component
      {...inputBuilder.props}
      state={state?.form?.data}
      path={inputBuilder.path}
      inputBuilder={inputBuilder}
      errorMessage={inputBuilder.validation?.errorMessage || ' '}
      isInvalid={inputBuilder.validation?.isInvalid}
      {..._props}
    />
  );
});
