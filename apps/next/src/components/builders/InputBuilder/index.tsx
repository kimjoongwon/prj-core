import { observer } from 'mobx-react-lite';
import { InputBuilder as InputBuilderInterface } from '@shared/types';
import { ComponentManager } from '@shared/frontend';
import { usePageState } from '../Page/PageBuilder';
import { TabNavigation } from '../TabNavigation/TabNavigation';
import { DataGridBuilder } from '../DataGridBuilder/DataGridBuilder';

interface InputBuilderProps {
  inputBuilder: InputBuilderInterface;
  data?: (unknown & { id: string })[];
}

export const InputBuilder = observer((props: InputBuilderProps) => {
  const state = usePageState();
  const { inputBuilder } = props; // @ts-ignore
  const Component = ComponentManager?.[inputBuilder.type];

  if (inputBuilder.type === 'DataGridBuilder') {
    return (
      <DataGridBuilder dataGridBuilder={inputBuilder.props.dataGridBuilder} />
    );
  }

  if (inputBuilder.type === 'TabNavigation') {
    return <TabNavigation tabBuilder={inputBuilder.props.tabBuilder} />;
  }

  if (!Component) {
    return null;
  }

  return (
    <Component
      {...inputBuilder.props}
      state={state}
      path={inputBuilder.path}
      inputBuilder={inputBuilder}
    />
  );
});
