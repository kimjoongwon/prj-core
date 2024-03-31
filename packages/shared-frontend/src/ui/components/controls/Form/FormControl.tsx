import { isUndefined } from 'lodash-es';
import React, { Children, ReactElement, useState } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import {
  ajv,
  getErrorFromErrorsByPath,
  getErrorMessageFromSchemaByPath,
} from '../../../../libs/ajv';

interface FormControlProps<T> {
  children: ReactElement;
  timings?: string[];
  schema?: T;
  label?: string;
}

export interface ValidationState {
  isInvalid: boolean;
  errorMessage: string;
  success: boolean;
}

export const FormControl = observer(
  <T extends any>(props: FormControlProps<T>) => {
    const { children, timings = [], schema, label } = props;

    const [validation, setValidation] = useState<ValidationState>({
      errorMessage: ' ',
      isInvalid: false,
      success: true,
    });

    const child = Children.only(children);

    const callbacks =
      timings?.map(timing => {
        return {
          [timing]: () => {
            if (!child.props.state) {
              return null;
            }
            const _schema: any = schema;
            const validate = ajv.compile(_schema as any);
            const valid = validate(toJS(child.props.state));

            validation.errorMessage = '';

            validation.isInvalid = false;

            validation.success = valid;
            let errorMessage = null;

            if (!valid) {
              const error = getErrorFromErrorsByPath(
                validate.errors || [],
                child.props.path,
              );

              if (!child.props.path) {
                throw new Error('path is required');
              }
              const errorMessage = getErrorMessageFromSchemaByPath(
                _schema,
                child.props.path,
                error,
              );

              validation.errorMessage = errorMessage;

              validation.isInvalid = isUndefined(errorMessage)
                ? false
                : true;
            }

            setValidation({ ...validation });
          },
        };
      }) || [];

    const childProps = Object.assign({ validation }, ...callbacks);

    return (
      <div className="flex flex-col flex-1">
        {label && <p className="text-medium font-bold">{label}</p>}
        {React.cloneElement(child, childProps)}
      </div>
    );
  },
);
