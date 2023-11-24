;

import { get, isUndefined } from 'lodash-es';
import React, { Children, ReactElement, useRef, useState } from 'react';
import { ZodSchema } from 'zod';

interface FormControlProps<T> {
  children: ReactElement;
  timings: string[];
  schema: T;
}

export interface ValidationState {
  isInvalid: boolean;
  errorMessage: string;
  success: boolean;
}

export const FormControl = <T extends any>(props: FormControlProps<T>) => {
  const { children, timings, schema } = props;

  const [validation, setValidation] = useState<ValidationState>({
    errorMessage: ' ',
    isInvalid: false,
    success: true,
  });

  const ref = useRef<HTMLElement>();

  const child = Children.only(children);

  const callbacks = timings.map(timing => {
    return {
      [timing]: () => {
        if (!child.props.state) {
          return null;
        }

        const result = (schema as ZodSchema).safeParse(child.props.state);

        validation.errorMessage = '';

        validation.isInvalid = false;

        validation.success = result.success;

        if (!result.success) {
          const errorMessage = get(result?.error.format(), child.props.path)?._errors.join('-');

          validation.errorMessage = errorMessage || '';

          validation.isInvalid = isUndefined(errorMessage) ? false : true;
        }

        setValidation({ ...validation });
      },
    };
  });

  const childProps = Object.assign({ ref, validation }, ...callbacks);

  return React.cloneElement(child, childProps);
};
