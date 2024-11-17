import React, { Children, ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import { isEmpty } from 'remeda';
import { IElement } from '@shared/types';

interface FormValidatorProps {
  children: ReactElement;
  state: IElement;
}

export const FormValidator = observer((props: FormValidatorProps) => {
  const { children, state } = props;

  const child = Children.only(children);

  if (child === null) {
    throw new Error('child is required');
  }

  const callbacks =
    state.input.validator.validation.timings?.map(timing => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [timing]: (value: any) => {
          if (state.input.validator.validation.required) {
            if (isEmpty(value)) {
              state.input.errorMessage =
                state.input.validator.validation.messages?.['required'];
              state.input.isInvalid = true;
              return;
            }

            state.input.isInvalid = false;
            state.input.errorMessage = ' ';
          }
        },
      };
    }) || [];

  const childProps = Object.assign(
    {
      isInvalid: state.input.isInvalid,
      errorMessage: state.input.errorMessage,
    },
    ...callbacks,
  );
  return <>{React.cloneElement(child, childProps)}</>;
});
