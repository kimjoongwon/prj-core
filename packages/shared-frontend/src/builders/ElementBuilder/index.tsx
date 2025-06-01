import { observer } from 'mobx-react-lite';
import { ElementBuilder as ElementBuilderInterface } from '@shared/types';
import { ComponentManager } from '../../../index';
import { usePageState } from '../Page/PageBuilder';
import { InputValidationBuilder } from '../InputValidationBuilder/InputValidation';

interface ElementBuilderProps {
  elementBuilder: ElementBuilderInterface;
  data?: (unknown & { id: string })[];
}

export const ElementBuilder = observer((props: ElementBuilderProps) => {
  const state = usePageState();
  const { elementBuilder } = props; // @ts-ignore
  const Component = ComponentManager?.[elementBuilder.name];

  // if (elementBuilder.name === 'DataGridBuilder') {
  //   return (
  //     <DataGridBuilder dataGridBuilder={elementBuilder.props.dataGridBuilder} />
  //   );
  // }

  // if (elementBuilder.name === 'TabNavigation') {
  //   return <TabNavigation tabBuilder={elementBuilder.props.tabBuilder} />;
  // }

  // if (!Component) {
  //   return null;
  // }

  return (
    <InputValidationBuilder validation={elementBuilder.validation}>
      <Component
        {...elementBuilder.props}
        state={state}
        path={elementBuilder.path}
        elementBuilder={elementBuilder}
      />
    </InputValidationBuilder>
  );
});
