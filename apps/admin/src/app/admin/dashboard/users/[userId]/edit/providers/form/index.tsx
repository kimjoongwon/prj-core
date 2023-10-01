'use client';

import { SignupInput } from '@__generated__/graphql';
import { useSignUp, useUserQuery } from '@hooks';
import { Button, ContainerProps } from '@kimjwally/ui';
import { defaults, defaultsDeep } from 'lodash-es';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { FormEvent, createContext } from 'react';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  profile: z.object({
    nickname: z.string(),
    phone: z.string(),
  }),
});

interface FormContextProps {
  schema: typeof schema;
  state: SignupInput;
}

export const FormContext = createContext<FormContextProps>(
  {} as FormContextProps,
);

export const userDefaultObject: SignupInput = {
  email: '',
  password: '',
  profile: {
    nickname: '',
    phone: '',
  },
};

export const FormProvider = observer((props: ContainerProps) => {
  const { userId = '' } = useParams();
  const { data } = useUserQuery(userId as string);

  const user = defaultsDeep({ ...data?.user, password: '' }, userDefaultObject);

  const state = useLocalObservable(() => user);
  const [signUp, { loading }] = useSignUp({ signUpInput: state });

  const onSubmit = () => {
    signUp();
  };

  return (
    <>
      <FormContext.Provider
        value={{
          state,
          schema,
        }}
      >
        {props.children}
      </FormContext.Provider>
      <Button isLoading={loading} onClick={onSubmit}>
        Save
      </Button>
    </>
  );
});
