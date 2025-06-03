import { ButtonProps } from '@heroui/react';
import { Button } from '../Button';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { MobxProps, Validations } from '@shared/types';
import { useEffect } from 'react';
import { get } from 'lodash-es';
import { reaction } from 'mobx';

export type SubmitButtonProps<T> = ButtonProps &
  MobxProps<T> & {
    validations: Validations;
  };

export const SubmitButton = observer(
  <T extends object>(props: SubmitButtonProps<T>) => {
    const { children, state, path, validations, ...rest } = props;

    const localState = useLocalObservable(() => ({
      errorMessages: [] as string[],
    }));

    useEffect(() => {
      const disposer = reaction(
        () => JSON.stringify(get(state, path)),
        () => {
          const elements = get(state, path);
          Object.entries(elements).forEach(([key, value]) => {
            const validation = validations[key];

            localState.errorMessages = [];
            if (validation) {
              if (!validation) return;

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

              if (
                validation?.min?.value &&
                Number(value) < validation.min.value
              ) {
                localState.errorMessages.push(validation.min.message);
              }

              if (
                validation?.max?.value &&
                Number(value) > validation.max.value
              ) {
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
            }
          });
        },
      );

      return disposer;
    }, []);

    return (
      <Button
        {...rest}
        type="submit"
        color="primary"
        isDisabled={localState.errorMessages.length > 0}
      >
        {children}
      </Button>
    );
  },
);
