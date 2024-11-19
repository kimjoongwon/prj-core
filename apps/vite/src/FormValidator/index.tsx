import React, { Children, ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import { isEmpty } from 'remeda';
import { BValidation, State } from '@shared/types';

interface FormValidatorProps {
  children: ReactElement;
  state: State;
  validation: BValidation;
  componentNo: number;
}

export const FormValidator = observer((props: FormValidatorProps) => {
  const { children, state, validation, componentNo } = props;

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
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              state.form.components[componentNo].props.errorMessage =
                validation.messages?.['required'];
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              state.form.components[componentNo].props.isInvalid = true;
              return;
            }
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          state.form.components[componentNo].props.isInvalid = false;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          state.form.components[componentNo].props.errorMessage = '';
        },
      };
    }) || [];

  const childProps = Object.assign({}, ...callbacks);
  return <>{React.cloneElement(child, childProps)}</>;
});
