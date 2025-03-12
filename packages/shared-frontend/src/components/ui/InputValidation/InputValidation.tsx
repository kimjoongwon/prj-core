import { InputProps } from '@heroui/react';
import { Validation } from '@shared/types';
import { uniq } from 'lodash-es';
import { toJS } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { cloneElement } from 'react';

type InputValidationProps = {
  children: React.ReactElement;
  validation: Validation;
};

export const InputValidation = observer((props: InputValidationProps) => {
  const { children, validation } = props;
  const timings = validation?.timings;

  const localState = useLocalObservable(() => ({
    isInvalid: false,
    errorMessages: [],
  }));

  const callbacks = timings?.map(timing => {
    if (!validation) return [];
    return {
      [timing]: (value: string) => {
        localState.errorMessages = [];
        if (validation?.required?.value && !value) {
          localState.errorMessages.push(validation.required.message);
        }

        if (
          validation?.minLength?.value &&
          value?.length < validation.minLength.value
        ) {
          localState.errorMessages.push(validation.minLength.message);
        }

        if (
          validation?.maxLength?.value &&
          value?.length > validation.maxLength.value
        ) {
          localState.errorMessages.push(validation.maxLength.message);
        }

        if (validation?.min?.value && Number(value) < validation.min.value) {
          localState.errorMessages.push(validation.min.message);
        }

        if (validation?.max?.value && Number(value) > validation.max.value) {
          localState.errorMessages.push(validation.max.message);
        }

        if (validation?.patterns) {
          validation.patterns.forEach(pattern => {
            const regex = new RegExp(pattern.value);
            if (!regex.test(value)) {
              localState.errorMessages.push(pattern.message);
            }
          });
        }

        localState.isInvalid = localState.errorMessages.length > 0;
        localState.errorMessages = uniq(localState.errorMessages);
      },
    };
  });

  const _props = callbacks?.reduce((acc, callback) => {
    return { ...acc, ...callback };
  });
  // @ts-ignore
  return cloneElement(children, {
    ...(_props || {}),
    isInvalid: localState.isInvalid,
    errorMessage: () => (
      <ul>
        {localState.errorMessages?.map((error, i) => (
          <li key={i}>{error}</li>
        ))}
      </ul>
    ),
  } as InputProps);
});
