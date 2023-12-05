'use client';

import { Button, LoginForm, Spacer } from '@coc/ui';
import { useLocalObservable } from 'mobx-react-lite';
import { useCoCRouter } from '../../shared/hooks/common';
import { useMutation } from '@apollo/client';
import { gql } from '@__generated__';
import { DASHBOARD_PAGE_PATH } from '../../shared/constants/paths';

const LOGIN = gql(`
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
          url: DASHBOARD_PAGE_PATH,
        });
      },
    });
  };

  return (
    <>
      <div className="w-full h-40 flex items-center justify-center">
        <div className="font-bold text-4xl text-primary-700">PROMISE</div>
      </div>
      <LoginForm state={state.form} />
      <Spacer y={8} />
      <Button fullWidth onClick={onClickLogin} isLoading={loading}>
        로그인
      </Button>
    </>
  );
}
