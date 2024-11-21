import React, { Children, ReactElement } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { isEmpty } from 'remeda';
import { BValidation, State } from '@shared/types';

interface FormValidatorProps {
  children: ReactElement;
  state: State;
  validation: BValidation;
  componentNo: number;
}

export const FormValidator = observer((props: FormValidatorProps) => {
  const { children, validation } = props;

  const state = useLocalObservable(() => ({
    errorMessage: '',
    isInvalid: false,
  }));

  const child = Children.only(children);

  if (child === null) {
    throw new Error('child is required');
  }

  const callbacks =
    validation.timings?.map(timing => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [timing]: (value: any) => {
          if (validation.required) {
            if (isEmpty(value)) {
              state.errorMessage = validation.messages?.['required'] as string;
              state.isInvalid = true;
              return;
            }
          }
          state.isInvalid = false;
          state.errorMessage = '';
        },
      };
    }) || [];

  const childProps = Object.assign(
    {
      isInvalid: state.isInvalid,
      errorMessage: state.errorMessage,
    },
    ...callbacks,
  );
  return <>{React.cloneElement(child, childProps)}</>;
});
