'use client';

import { SignupInput } from '@__generated__/graphql';
import { useSignUp, useState, useUserQuery } from '@hooks';
import { Button, ContainerProps } from '@kimjwally/ui';
import { defaultsDeep } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { createContext } from 'react';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  profile: z.object({
    nickname: z.string(),
    phone: z.string(),
  }),
});

interface UserEditPageContextProps {
  schema: typeof schema;
  state: SignupInput;
}

export const UserEditPageContext = createContext<UserEditPageContextProps>(
  {} as UserEditPageContextProps,
);

export const userDefaultObject: SignupInput = {
  email: '',
  password: '',
  profile: {
    nickname: '',
    phone: '',
  },
};

export const UserEditPageProvider = observer((props: ContainerProps) => {
  const { userId = '' } = useParams();
  const { data } = useUserQuery(userId as string);

  const user = defaultsDeep({ ...data?.user, password: '' }, userDefaultObject);

  const state = useState(user);
  const [signUp, { loading }] = useSignUp({ signUpInput: state });

  const onSubmit = () => signUp();

  return (
    <>
      <UserEditPageContext.Provider
        value={{
          state,
          schema,
        }}
      >
        {props.children}
      </UserEditPageContext.Provider>
      <Button isLoading={loading} onClick={onSubmit}>
        Save
      </Button>
    </>
  );
});
