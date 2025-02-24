import { ValidationBuilder } from '@shared/types';
import { uniq } from 'lodash-es';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { cloneElement } from 'react';

type ValidationProps = {
  children: React.ReactElement;
  validation: ValidationBuilder;
};

export const Validation = observer((props: ValidationProps) => {
  const { children, validation } = props;
  const conditions = validation?.conditions;
  const timings = validation?.timings;

  const localState = useLocalObservable(() => ({
    isInvalid: false,
    errorMessages: [],
  }));

  const callbacks = timings?.map(timing => {
    if (!conditions) return [];
    return {
      [timing]: (value: string) => {
        localState.errorMessages = [];
        if (conditions?.required?.value && !value) {
          localState.errorMessages.push(conditions.required.message);
        }

        if (
          conditions?.minLength?.value &&
          value?.length < conditions.minLength.value
        ) {
          localState.errorMessages.push(conditions.minLength.message);
        }

        if (
          conditions?.maxLength?.value &&
          value?.length > conditions.maxLength.value
        ) {
          localState.errorMessages.push(conditions.maxLength.message);
        }

        if (conditions?.min?.value && Number(value) < conditions.min.value) {
          localState.errorMessages.push(conditions.min.message);
        }

        if (conditions?.max?.value && Number(value) > conditions.max.value) {
          localState.errorMessages.push(conditions.max.message);
        }

        if (conditions?.patterns) {
          conditions.patterns.forEach(pattern => {
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
  });
});
