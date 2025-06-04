import { InputProps } from '@heroui/react';
import { PageBuilder, Validation } from '@shared/types';
import { uniq } from 'lodash-es';
import { toJS } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { cloneElement } from 'react';
import { usePageState } from '../PageBuilder';

type InputValidationBuilderProps = {
  children: React.ReactElement;
  validation?: Validation;
  state?: PageBuilder['state'];
};

export const InputValidationBuilder = observer(
  (props: InputValidationBuilderProps) => {
    const { children, validation } = props;
    const timings = validation?.timings;
    const state = usePageState();

    const localState = useLocalObservable(() => ({
      isInvalid: false,
      errorMessages: [] as string[],
    }));

    const callbacks = timings?.map(timing => {
      if (!validation) return [];
      return {
        [timing]: (value: string) => {
          localState.errorMessages = [];
          if (validation?.required?.value) {
            if (!value) {
              localState.errorMessages.push(validation.required.message);
              state?.form?.button?.errorMessages?.push(
                validation.required.message,
              );
            } else {
              if (state?.form?.button) {
                state.form.button.errorMessages = (
                  state?.form?.button?.errorMessages || []
                ).filter(
                  errorMessage => errorMessage !== validation.required?.message,
                );
              }
            }
          }

          if (validation?.minLength?.value) {
            if (value?.length < validation.minLength.value) {
              localState.errorMessages.push(validation.minLength.message);
              state?.form?.button?.errorMessages?.push(
                validation.minLength?.message,
              );
            } else {
              if (state?.form?.button) {
                state.form.button.errorMessages = (
                  state?.form?.button?.errorMessages || []
                ).filter(
                  errorMessage =>
                    errorMessage !== validation.minLength?.message,
                );
              }
            }
          }

          if (
            validation?.maxLength?.value &&
            value?.length > validation.maxLength.value
          ) {
            localState.errorMessages.push(validation.maxLength.message);
            state?.form?.button?.errorMessages?.push(
              validation.maxLength?.message,
            );
          } else {
            if (state?.form?.button) {
              state.form.button.errorMessages = (
                state?.form?.button?.errorMessages || []
              ).filter(
                errorMessage => errorMessage !== validation.maxLength?.message,
              );
            }
          }

          if (validation?.min?.value) {
            if (Number(value) < validation.min.value) {
              localState.errorMessages.push(validation.min.message);
              state?.form?.button?.errorMessages?.push(validation.min?.message);
            } else {
              if (state?.form?.button) {
                state.form.button.errorMessages = (
                  state?.form?.button?.errorMessages || []
                ).filter(
                  errorMessage => errorMessage !== validation.min?.message,
                );
              }
            }
          }

          if (validation?.max?.value && Number(value) > validation.max.value) {
            localState.errorMessages.push(validation.max.message);
            state?.form?.button?.errorMessages?.push(validation.max?.message);
          } else {
            if (state?.form?.button) {
              state.form.button.errorMessages = (
                state?.form?.button?.errorMessages || []
              ).filter(
                errorMessage => errorMessage !== validation.max?.message,
              );
            }
          }

          if (validation?.patterns) {
            validation.patterns.forEach(pattern => {
              const regex = new RegExp(pattern.value);
              if (!regex.test(value)) {
                localState.errorMessages.push(pattern.message);
                state?.form?.button?.errorMessages?.push(pattern.message);
              } else {
                if (state?.form?.button) {
                  state.form.button.errorMessages = (
                    state?.form?.button?.errorMessages || []
                  ).filter(errorMessage => pattern.message !== errorMessage);
                }
              }
            });
          }

          localState.isInvalid = localState.errorMessages.length > 0;
          if (state?.form?.button?.errorMessages) {
            state.form.button.errorMessages = uniq(
              state?.form?.button?.errorMessages || [],
            );
          }

          localState.errorMessages = uniq(localState.errorMessages);
          console.log(toJS(state?.form?.button?.errorMessages));
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
  },
);
