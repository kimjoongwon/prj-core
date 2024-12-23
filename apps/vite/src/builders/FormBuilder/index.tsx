import { FormBuilder, FormBuilder as FormBuilderState } from '@shared/types';
import { Button } from '../ButtonBuilder';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { createContext } from 'react';
import React from 'react';
import { toJS } from 'mobx';

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

export const FormContext = createContext<FormBuilder['state'] | null>(null);

export const FormProvder = <T extends object>(props: FormProviderProps<T>) => {
  const { data } = props;
  const state: FormBuilder['state'] = useLocalObservable(() => {
    return {
      ...props.state,
      body: {
        ...props.state.body,
        ...data,
      },
    };
  });

  return (
    <FormContext.Provider value={state}>{props.children}</FormContext.Provider>
  );
};

export const useFormState = () => {
  const state = React.useContext(FormContext);
  // if (!state) {
  //   throw new Error('useState must be used within a FormProvider');
  // }
  return state;
};

export const Form = observer((props: FormBuilderProps) => {
  const { formBuilder, children } = props;

  return (
    <form className="space-y-4">
      {children}
      <Button buttonBuilder={formBuilder.button} form={formBuilder} />
    </form>
  );
});
