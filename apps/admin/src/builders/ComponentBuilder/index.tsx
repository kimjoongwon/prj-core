import { observer } from 'mobx-react-lite';
import { ComponentBuilder as ComponentBuilderState } from '@shared/types';
import { ComponentManager } from '@shared/frontend';
import { isEmpty } from 'lodash-es';
import { usePageState } from '../Page/PageBuilder';
import { TabNavigation } from '../TabNavigation/TabNavigation';
import { DataGridBuilder } from '../DataGridBuilder/DataGridBuilder';
import { Outlet } from 'react-router-dom';

interface ComponentBuilderProps {
  componentBuilder: ComponentBuilderState;
  data?: (unknown & { id: string })[];
}

export const ComponentBuilder = observer((props: ComponentBuilderProps) => {
  const state = usePageState();
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

  if (componentBuilder.type === 'DataGridBuilder') {
    return (
      <DataGridBuilder
        dataGridBuilder={componentBuilder.props.dataGridBuilder}
      />
    );
  }

  if (componentBuilder.type === 'TabNavigation') {
    return <TabNavigation tabBuilder={componentBuilder.props.tabBuilder} />;
  }

  if (componentBuilder.type === 'Outlet') {
    return <Outlet />;
  }

  if (componentBuilder.visibleCondition) {
    const { eq } = componentBuilder.visibleCondition;
    const value = state?.form?.data[eq.path];
    if (value !== eq.value) {
      return null;
    }
  }

  return (
    <Component
      {...componentBuilder.props}
      state={state?.form?.data}
      path={componentBuilder.path}
      componentBuilder={componentBuilder}
      errorMessage={componentBuilder.validation?.errorMessage || ' '}
      isInvalid={componentBuilder.validation?.isInvalid}
      {..._props}
    />
  );
});
