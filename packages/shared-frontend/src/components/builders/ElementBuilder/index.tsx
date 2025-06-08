import { observer } from 'mobx-react-lite';
import { ElementBuilder as ElementBuilderInterface } from '@shared/types';
import { ComponentManager } from '../../../../index';
import { usePageState } from '../PageBuilder';
import { InputValidationBuilder } from '../InputValidationBuilder/InputValidation';
import { v4 } from 'uuid';

interface ElementBuilderProps {
  elementBuilder: ElementBuilderInterface;
  data?: (unknown & { id: string })[];
}

export const ElementBuilder = observer((props: ElementBuilderProps) => {
  const state = usePageState();
  const { elementBuilder } = props;
  const Component = ComponentManager?.[elementBuilder.name];

  const renderElement = (element: ElementBuilderInterface) => {
    return <ElementBuilder key={v4()} elementBuilder={element} />;
  };

  return (
    <InputValidationBuilder validation={elementBuilder.validation}>
      <Component
        key={v4()}
        state={state}
        path={elementBuilder?.path}
        {...elementBuilder.props}
      >
        {elementBuilder.props?.children ||
          elementBuilder?.children?.map(renderElement)}
      </Component>
    </InputValidationBuilder>
  );
});
