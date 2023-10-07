'use client';

import { LoginForm } from '@coc/ui';
import LoginButton from './button';
import { useLocalObservable } from 'mobx-react-lite';

export default function Page() {
  const loginPage = useLocalObservable(() => ({
    login: {
      form: {
        email: '',
        password: '',
      },
    },
  }));

  return (
    <div className="flex flex-col items-center">
      <LoginForm buttons={<LoginButton />} state={loginPage.login.form} />
    </div>
  );
}
