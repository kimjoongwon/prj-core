import { FormBuilder, FormBuilder as FormBuilderState } from '@shared/types';
import { ButtonBuilder } from '../ButtonBuilder';
import { observer } from 'mobx-react-lite';
import { VStack } from '@shared/frontend';

interface FormBuilderProps {
  formBuilder: FormBuilderState;
  children: React.ReactNode;
}
interface FormBuilderProps {
  formBuilder: FormBuilder;
}

export const Form = observer((props: FormBuilderProps) => {
  const { formBuilder, children } = props;

  return (
    <VStack className="flex-1 w-full space-y-1">
      {children}
      {formBuilder.button && (
        <ButtonBuilder buttonBuilder={formBuilder.button} />
      )}
    </VStack>
  );
});
