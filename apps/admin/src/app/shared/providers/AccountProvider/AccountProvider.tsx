import React from 'react';
import { gql } from '@__generated__';
import { LoginInput, User } from '@__generated__/graphql';
import { useLocalObservable } from 'mobx-react-lite';
import { useCoCRouter } from '@hooks';
import { useMutation } from '@apollo/client';
import { DASHBOARD_PAGE_PATH } from '@constants';

interface Account {
  loginForm: LoginInput;
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const LOGIN = gql(`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      user {
        id
        name
        email
        createdAt
      }
      accessToken
      refreshToken
    }
  }
`);

export const AccountContext = React.createContext<Account>({} as Account);

export const AccountProvider = (props: { children: React.ReactNode }) => {
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
          this.user = data.login.user;
          router.push({ url: DASHBOARD_PAGE_PATH });
        },
      });
    },
    logout() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      account.user = null;
    },
  }));

  return (
    <AccountContext.Provider value={account}>
      {props.children}
    </AccountContext.Provider>
  );
};
