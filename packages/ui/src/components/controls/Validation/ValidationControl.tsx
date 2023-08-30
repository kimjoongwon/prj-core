import { get, isUndefined } from 'lodash-es';
import React, { Children, ReactElement, useRef, useState } from 'react';
import { z } from 'zod';

interface FormControlProps {
  children: ReactElement;
  timings: string[];
  schema: z.ZodObject<any>
}


export interface ValidationState {
  state: 'invalid' | 'valid', 
  errorMessage: string, 
  success: boolean
}


export const FormControl = (props: FormControlProps) => {
  const { children, timings, schema } = props;

  const [validation, setValidation] = useState<ValidationState>({
    errorMessage: ' ',
    state: 'valid',
    success: true,
  })


  const ref = useRef<HTMLElement>()

  const child = Children.only(children);

  const callbacks = timings.map(timing => {
    return ({
      [timing]: () => {

        const result = schema.safeParse(child.props.state)
        validation.success = result.success
        
        if (!result.success) {
          const errorMessage = get(result?.error.format(), child.props.path)?._errors.join('-')
          validation.errorMessage = errorMessage || '' 
          validation.state = isUndefined(errorMessage) ? 'valid': 'invalid'
        } 
        
        setValidation({...validation})
      }
    })
  }) 
  
  const childProps = Object.assign({ref, validation},  ...callbacks)

  return React.cloneElement(child, childProps)
};