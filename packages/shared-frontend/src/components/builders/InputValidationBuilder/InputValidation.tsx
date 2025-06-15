import { InputProps } from '@heroui/react';
import { PageBuilder, Validation } from '@shared/types';
import { uniq } from 'lodash-es';
import { toJS } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { cloneElement } from 'react';
import { usePageState } from '../PageBuilder/PageBuilder';
type InputValidationBuilderProps = {
  children: React.ReactElement;
  validation?: Validation;
  state?: PageBuilder['state'];
};

export const InputValidationBuilder = observer(
  (props: InputValidationBuilderProps) => {
    const { children } = props;
    const validation = toJS(props.validation);
    const timings = validation?.timings;
    const state = usePageState();
    const localState = useLocalObservable(() => ({
      isInvalid: false,
      errorMessages: [] as string[],
    }));

    // Helper functions to manage error messages
    const addError = (message: string) => {
      localState.errorMessages.push(message);
      state?.form?.button?.errorMessages?.push(message);
    };

    const removeError = (message: string) => {
      if (state?.form?.button) {
        state.form.button.errorMessages = (
          state?.form?.button?.errorMessages || []
        ).filter(errorMessage => errorMessage !== message);
      }
    };

    const validateRule = (condition: boolean, message: string) => {
      if (condition) {
        addError(message);
      } else {
        removeError(message);
      }
    };

    const callbacks = timings?.map(timing => {
      if (!validation) return {};

      return {
        [timing]: (value: string) => {
          localState.errorMessages = [];

          // Required validation
          if (validation.required?.value) {
            validateRule(!value, validation.required.message);
          }

          // Length validations
          if (validation.minLength?.value) {
            validateRule(
              value?.length < validation.minLength.value,
              validation.minLength.message,
            );
          }

          if (validation.maxLength?.value) {
            validateRule(
              value?.length > validation.maxLength.value,
              validation.maxLength.message,
            );
          }

          // Number validations
          const numValue = Number(value);
          if (validation.min?.value) {
            validateRule(
              numValue < validation.min.value,
              validation.min.message,
            );
          }

          if (validation.max?.value) {
            validateRule(
              numValue > validation.max.value,
              validation.max.message,
            );
          }

          // Pattern validations
          validation.patterns?.forEach(pattern => {
            const regex = new RegExp(pattern.value);
            validateRule(!regex.test(value), pattern.message);
          });

          // Update states
          localState.isInvalid = localState.errorMessages.length > 0;
          if (state?.form?.button?.errorMessages) {
            state.form.button.errorMessages = uniq(
              state.form.button.errorMessages,
            );
          }
          localState.errorMessages = uniq(localState.errorMessages);
        },
      };
    });

    const _props = callbacks?.reduce(
      (acc, callback) => ({ ...acc, ...callback }),
      {},
    );

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
  },
);
