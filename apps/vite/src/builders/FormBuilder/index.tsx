import { FormBuilder as FormBuilderState } from '@shared/types';
import { ButtonBuilder } from '../ButtonBuilder';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

interface FormBuilderProps {
  state: FormBuilderState;
  children: React.ReactNode;
}

export const FormBuilder = observer((props: FormBuilderProps) => {
  const { state, children } = props;

  return (
    <form className="space-y-4">
      {children}
      <ButtonBuilder state={state.button} form={toJS(state)} />
    </form>
  );
});
