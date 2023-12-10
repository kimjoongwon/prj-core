'use client';

import React from 'react';
import { gql } from '@__generated__';
import { LoginInput, LoginMutation } from '@__generated__/graphql';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCoCRouter } from '@hooks';
import { useMutation } from '@apollo/client';
import { DASHBOARD_PAGE_PATH, LOGIN_PAGE_PATH } from '@constants';

const LOGIN = gql(`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      user {
        id
        name
        email
        createdAt
        tenants {
          id
          role {
            id
            name
          }
        }
      }
      accessToken
      refreshToken
    }
  }
`);
interface Account {
  loginForm: LoginInput;
  user: LoginMutation['login']['user'] | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

export const AccountContext = React.createContext<Account>({} as Account);

export const AccountProvider = observer(
  (props: { children: React.ReactNode }) => {
    const [login, { loading }] = useMutation(LOGIN);
    const router = useCoCRouter();
    const account = useLocalObservable<Account>(() => ({
      loading,
      loginForm: {
        email: '',
        password: '',
      },
      user: null,
      login() {
        const { email, password } = account.loginForm;
        console.log(email, password);
        login({
          variables: {
            data: {
              email,
              password,
            },
          },
          onCompleted: data => {
            localStorage.setItem('accessToken', data.login.accessToken);
            localStorage.setItem('refreshToken', data.login.refreshToken);
            localStorage.setItem('tenantId', data.login.user.tenants?.[0]?.id);
            this.user = data.login.user;
            router.push({ url: DASHBOARD_PAGE_PATH });
          },
        });
      },
      logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        account.user = null;
        router.push({ url: LOGIN_PAGE_PATH });
      },
    }));

    return (
      <AccountContext.Provider value={account}>
        {props.children}
      </AccountContext.Provider>
    );
  },
);
