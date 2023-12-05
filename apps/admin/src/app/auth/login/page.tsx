'use client';

import { Button, LoginForm, Spacer } from '@coc/ui';
import { useLocalObservable } from 'mobx-react-lite';
import { useCoCRouter } from '../../shared/hooks/common';
import { useMutation } from '@apollo/client';
import { gql } from '@__generated__';

export const LOGIN = gql(`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      accessToken
      refreshToken
    }
  }
`);

export default function Page() {
  const router = useCoCRouter();
  const state = useLocalObservable(() => ({
    form: {
      email: '',
      password: '',
    },
  }));

  const [login, { loading }] = useMutation(LOGIN);

  const onClickLogin = () => {
    login({
      variables: { data: state.form },
      onCompleted(data) {
        localStorage.setItem('accessToken', data.login.accessToken);
        localStorage.setItem('refreshToken', data.login.refreshToken);
        router.push({
          url: '/admin/roles',
        });
      },
    });
  };

  return (
    <div className="">
      <LoginForm state={state.form} />
      <Spacer y={2} />
      <Button fullWidth onClick={onClickLogin} isLoading={loading}>
        Login
      </Button>
    </div>
  );
}
