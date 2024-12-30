import { FormBuilder, FormBuilder as FormBuilderState } from '@shared/types';
import { ButtonBuilder } from '../ButtonBuilder';
import { observer } from 'mobx-react-lite';
import { createContext, useContext } from 'react';
import { observable } from 'mobx';
import { VStack } from '@shared/frontend';

interface FormBuilderProps {
  formBuilder: FormBuilderState;
  children: React.ReactNode;
}
interface FormBuilderProps {
  formBuilder: FormBuilder;
}

interface FormProviderProps<T> {
  state: FormBuilder['state'];
  data?: T;
  children: React.ReactNode;
}

const FormContext = createContext<FormBuilder['state'] | null>(null);

export const FormProvder = <T extends object>(props: FormProviderProps<T>) => {
  const { data } = props;
  const state: FormBuilder['state'] = observable({
    ...props.state,
    payload: {
      ...props.state?.payload,
      ...data,
    },
  });

  return (
    <FormContext.Provider value={state}>{props.children}</FormContext.Provider>
  );
};

export const useFormState = () => {
  const state = useContext(FormContext);
  return state;
};

export const Form = observer((props: FormBuilderProps) => {
  const { formBuilder, children } = props;

  return (
    <VStack className="flex-1 w-full space-y-1">
      {children}
      <ButtonBuilder buttonBuilder={formBuilder.button!} />
    </VStack>
  );
});
